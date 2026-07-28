import React, { useState, useEffect } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { User, Sparkles, Check, X } from 'lucide-react';

export const UserNameModal: React.FC = () => {
  const { userName, setUserName, showNamePrompt, setShowNamePrompt, showToast } = useCabinet();
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    if (showNamePrompt) {
      setInputName(userName || '');
    }
  }, [showNamePrompt, userName]);

  if (!showNamePrompt) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = inputName.trim();
    if (finalName) {
      setUserName(finalName);
      showToast(`Welcome to PillWise, ${finalName}! 👋`, 'success');
    } else {
      setUserName('User');
      showToast('Welcome to PillWise AI Cabinet! 👋', 'info');
    }
    localStorage.setItem('pillwise_name_prompted', 'true');
    setShowNamePrompt(false);
  };

  const handleSkip = () => {
    if (!userName) {
      setUserName('User');
    }
    localStorage.setItem('pillwise_name_prompted', 'true');
    setShowNamePrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-slate-800 space-y-6">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <User className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome to PillWise! 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              What is your name? Let us personalize your AI medicine cabinet.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Your Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="e.g. Neha Kumar"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-800 rounded-xl text-sm font-medium focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Continue</span>
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-colors"
            >
              Continue as User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
