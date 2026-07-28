// Audio Alarm & Ringtone Service for PillWise Medicine Reminders

let audioCtx: AudioContext | null = null;
let alarmInterval: any = null;
let currentSpeechUtterance: SpeechSynthesisUtterance | null = null;
let customAudioElement: HTMLAudioElement | null = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play a dual-frequency phone alarm chime pulse (similar to Android/iOS alarm)
export function playAlarmBeep() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5 note
    osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6 note
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Tone 2 (offset)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, now + 0.12); // E6 note
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.28); // A6 note
    gain2.gain.setValueAtTime(0.35, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.35);
  } catch (err) {
    console.warn('AudioContext alarm play failed:', err);
  }
}

// Speak voice ringtone using Web Speech API
export function speakRingtone(text: string, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop prior speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly deliberate & clear
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    // Try to pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    currentSpeechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

// Start continuously ringing the alarm (combination of phone chime + spoken prompt or custom recorded voice)
export function startAlarmLoop(medicineName: string, dosage?: string, customVoiceUrl?: string) {
  stopAlarmLoop();

  // 1. If custom recorded voice URL exists, play custom voice audio on loop
  if (customVoiceUrl) {
    try {
      customAudioElement = new Audio(customVoiceUrl);
      customAudioElement.loop = true;
      customAudioElement.volume = 1.0;
      customAudioElement.play().catch(e => console.warn('Custom audio playback error:', e));
      
      // Also play backing alarm beeps
      alarmInterval = setInterval(() => {
        playAlarmBeep();
      }, 1200);
      return;
    } catch (e) {
      console.warn('Failed playing custom audio, falling back to voice synthesis:', e);
    }
  }

  // 2. Default Voice Speech Ringtone: "It's time to take your medicine: [Medicine Name]"
  const promptText = `Attention! It's time to take your medicine: ${medicineName}. ${dosage ? `Dosage: ${dosage}.` : ''} Please take it now.`;

  // Play initial chime
  playAlarmBeep();
  setTimeout(() => playAlarmBeep(), 300);

  // Announce voice message
  speakRingtone(promptText);

  // Set interval to continuously chime & repeat voice message
  let beepCount = 0;
  alarmInterval = setInterval(() => {
    playAlarmBeep();
    beepCount++;

    // Repeat voice speech every 4th chime pulse (~4-5 seconds)
    if (beepCount % 4 === 0) {
      if (!window.speechSynthesis.speaking) {
        speakRingtone(`It's time to take ${medicineName}!`);
      }
    }
  }, 1100);
}

// Stop all ringing sounds, audio and speech synthesis
export function stopAlarmLoop() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }

  if (customAudioElement) {
    customAudioElement.pause();
    customAudioElement.currentTime = 0;
    customAudioElement = null;
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn(e);
    }
  }
}

// Voice Recorder Utility for Custom User Ringtone
export class VoiceRingtoneRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.error('Microphone access denied or not supported:', err);
      return false;
    }
  }

  stopRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject('No active media recorder');
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          resolve(base64Data);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.stop();
    });
  }
}
