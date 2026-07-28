import React, { useState, useEffect, useRef } from 'react';
import { VoiceRingtoneRecorder, startAlarmLoop, stopAlarmLoop, playAlarmBeep, speakRingtone } from '../services/alarmAudio';
import { Mic, Square, Play, Trash2, Volume2, Check, BellRing, Sparkles, X, Music, Upload, AlertCircle } from 'lucide-react';

interface RingtoneSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const RingtoneSettingsModal: React.FC<RingtoneSettingsModalProps> = ({
  isOpen,
  onClose,
  showToast
}) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<VoiceRingtoneRecorder | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load existing custom ringtone from localStorage
    const saved = localStorage.getItem('pillwise_custom_ringtone');
    if (saved) {
      setCustomAudioUrl(saved);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartRecord = async () => {
    setMicError(null);
    const rec = new VoiceRingtoneRecorder();
    const started = await rec.startRecording();
    if (started) {
      setRecorder(rec);
      setRecording(true);
      showToast('Recording custom voice... Speak clearly into microphone!', 'info');
    } else {
      setMicError('Microphone permission was denied by browser. You can enable microphone permissions in your browser address bar or upload an audio voice recording file below.');
      showToast('Microphone access denied or not supported on browser.', 'error');
    }
  };

  const handleStopRecord = async () => {
    if (!recorder) return;
    try {
      const base64Audio = await recorder.stopRecording();
      setCustomAudioUrl(base64Audio);
      localStorage.setItem('pillwise_custom_ringtone', base64Audio);
      setRecording(false);
      setRecorder(null);
      showToast('Custom voice ringtone recorded & saved successfully! 🎤', 'success');
    } catch (err) {
      showToast('Failed to save voice recording.', 'error');
      setRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Audio file size exceeds 10MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomAudioUrl(result);
        localStorage.setItem('pillwise_custom_ringtone', result);
        showToast('Custom audio ringtone uploaded & saved! 🎵', 'success');
        setMicError(null);
      }
    };
    reader.onerror = () => {
      showToast('Failed reading uploaded audio file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleTestRingtone = (type: 'default' | 'custom') => {
    stopAlarmLoop();
    setIsPlayingPreview(true);

    if (type === 'custom' && customAudioUrl) {
      startAlarmLoop('Dolo 650', '1 tablet after meals', customAudioUrl);
    } else {
      startAlarmLoop('Dolo 650', '1 tablet after meals');
    }

    setTimeout(() => {
      stopAlarmLoop();
      setIsPlayingPreview(false);
    }, 6000);
  };

  const handleDeleteCustomRingtone = () => {
    stopAlarmLoop();
    localStorage.removeItem('pillwise_custom_ringtone');
    setCustomAudioUrl(null);
    showToast('Removed custom voice recording. Reverted to default alarm voice.', 'info');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 relative">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Alarm Ringtone & Custom Voice
              </h2>
              <p className="text-xs text-slate-400">Configure phone alarm ringtone and voice recordings</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAlarmLoop();
              onClose();
            }}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Option 1: Default Phone Alarm + Voice Speech */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Default Voice Ringtone</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Active System Voice
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Rings loudly with phone alarm chime and speaks: <br />
              <span className="font-bold text-slate-800 italic">"Attention! It's time to take your medicine..."</span>
            </p>

            <button
              onClick={() => handleTestRingtone('default')}
              disabled={isPlayingPreview}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test Default Phone Alarm</span>
            </button>
          </div>

          {/* Option 2: Record Custom Voice Ringtone */}
          <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-700" />
                <h3 className="font-bold text-purple-950 text-sm">Record Your Own Custom Voice Ringtone</h3>
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                Personalized
              </span>
            </div>

            <p className="text-xs text-purple-900/80 font-medium">
              Record a custom reminder voice note in your own voice (or family member's voice) like: <br />
              <span className="font-bold italic">"Hey Mom, time for your Dolo tablet now!"</span>
            </p>

            {micError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{micError}</p>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Recorder & File Upload Controls */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {!recording ? (
                <button
                  onClick={handleStartRecord}
                  className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Microphone Recording</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecord}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Recording... Click to Save</span>
                </button>
              )}

              {!recording && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-purple-300 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Audio File</span>
                </button>
              )}

              {customAudioUrl && !recording && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestRingtone('custom')}
                    disabled={isPlayingPreview}
                    className="px-3.5 py-2 bg-purple-200 hover:bg-purple-300 text-purple-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Custom Voice</span>
                  </button>

                  <button
                    onClick={handleDeleteCustomRingtone}
                    className="p-2 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                    title="Delete custom voice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {customAudioUrl && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-white p-2.5 rounded-xl border border-purple-200">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Custom Voice Ringtone active for upcoming medicine alarms!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              stopAlarmLoop();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};;
