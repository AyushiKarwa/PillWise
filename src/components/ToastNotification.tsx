import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useCabinet();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white border-slate-700';
        let icon = <Info className="w-5 h-5 text-emerald-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-900/90 backdrop-blur-md text-emerald-100 border-emerald-600/50 shadow-lg shadow-emerald-950/20';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-900/90 backdrop-blur-md text-amber-100 border-amber-600/50 shadow-lg shadow-amber-950/20';
          icon = <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-900/90 backdrop-blur-md text-rose-100 border-rose-600/50 shadow-lg shadow-rose-950/20';
          icon = <XCircle className="w-5 h-5 text-rose-300 shrink-0" />;
        } else {
          bg = 'bg-slate-900/90 backdrop-blur-md text-slate-100 border-slate-700 shadow-xl';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border ${bg} text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
