import React, { useEffect, useState } from 'react';
import { ReminderItem } from '../types';
import { startAlarmLoop, stopAlarmLoop, playAlarmBeep, speakRingtone } from '../services/alarmAudio';
import { BellRing, Check, Clock, Pill, Volume2, VolumeX, Sparkles, AlertCircle, RotateCcw, Mic } from 'lucide-react';

interface AlarmModalProps {
  reminder: ReminderItem | null;
  customVoiceUrl?: string | null;
  isTest?: boolean;
  onTake: (reminder: ReminderItem) => void;
  onSnooze: (reminder: ReminderItem) => void;
  onDismiss: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  reminder,
  customVoiceUrl,
  isTest = false,
  onTake,
  onSnooze,
  onDismiss
}) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (reminder) {
      // Start ringing when modal opens
      startAlarmLoop(
        reminder.medicineName,
        reminder.dosage,
        customVoiceUrl || undefined
      );
    }

    return () => {
      stopAlarmLoop();
    };
  }, [reminder, customVoiceUrl]);

  if (!reminder) return null;

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startAlarmLoop(reminder.medicineName, reminder.dosage, customVoiceUrl || undefined);
    } else {
      setIsMuted(true);
      stopAlarmLoop();
    }
  };

  const handleReplayVoice = () => {
    setIsMuted(false);
    stopAlarmLoop();
    startAlarmLoop(reminder.medicineName, reminder.dosage, customVoiceUrl || undefined);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 relative">
        {/* Top Glowing Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative overflow-hidden">
          {/* Animated pulsing background rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <span className="w-48 h-48 rounded-full border-4 border-white animate-ping" />
            <span className="w-32 h-32 rounded-full border-4 border-white animate-pulse" />
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner animate-bounce">
              <BellRing className="w-9 h-9 text-white" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTest ? 'Test Medicine Alarm' : 'Medicine Reminder Alarm'}</span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
              Time to take your medicine!
            </h2>
            <p className="text-xs text-emerald-100 font-medium">
              Scheduled for <span className="font-bold underline">{reminder.time}</span>
            </p>
          </div>
        </div>

        {/* Alarm Content & Details */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                Medication Details
              </span>
              {customVoiceUrl && (
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Custom Voice Active
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900">{reminder.medicineName}</h3>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold text-slate-700">
              <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block font-normal">Dosage</span>
                <span>{reminder.dosage || '1 Tablet'}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block font-normal">Schedule</span>
                <span>{reminder.repeat || 'Daily'}</span>
              </div>
            </div>

            {reminder.purpose && (
              <p className="text-xs text-slate-600 font-medium pt-1">
                <span className="font-bold text-slate-800">Purpose:</span> {reminder.purpose}
              </p>
            )}
          </div>

          {/* Sound Control Bar */}
          <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">Ringtone Playing</span>
                <span className="text-[10px] text-emerald-700 font-medium">
                  "{customVoiceUrl ? 'Custom Recorded Voice' : "It's time to take your medicine!"}"
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleReplayVoice}
                className="p-2 bg-white hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Replay Voice Ringtone"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {isMuted ? 'Unmute' : 'Mute Sound'}
              </button>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                stopAlarmLoop();
                onTake(reminder);
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Take Medicine Now</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  stopAlarmLoop();
                  onSnooze(reminder);
                }}
                className="py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Snooze (5 Mins)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopAlarmLoop();
                  onDismiss();
                }}
                className="py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Dismiss / Stop</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
