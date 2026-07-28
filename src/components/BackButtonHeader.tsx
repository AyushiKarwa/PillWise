import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { useCabinet } from '../context/CabinetContext';

interface BackButtonHeaderProps {
  title?: string;
  subtitle?: string;
}

export const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ title, subtitle }) => {
  const { setActiveSection } = useCabinet();

  return (
    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
      <button
        type="button"
        onClick={() => setActiveSection('Dashboard')}
        className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-2 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 transition-transform group-hover:-translate-x-0.5" />
        <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
        <span>Back to Home</span>
      </button>

      {title && (
        <div className="text-right">
          <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">{title}</span>
          {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
        </div>
      )}
    </div>
  );
};
