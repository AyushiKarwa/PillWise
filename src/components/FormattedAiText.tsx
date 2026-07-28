import React from 'react';
import { Bot, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Pill, Info } from 'lucide-react';

interface FormattedAiTextProps {
  text: string;
  className?: string;
}

export const FormattedAiText: React.FC<FormattedAiTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Function to clean raw markdown clutter (e.g., ###, **, *, __) and split into clean paragraphs/sections
  const cleanLine = (str: string) => {
    return str
      .replace(/^[#*-\s]+/g, '') // strip leading hashes/asterisks/dashes
      .replace(/\*\*(.*?)\*\*/g, '$1') // replace **bold** with plain text
      .replace(/\*(.*?)\*/g, '$1') // replace *italic* with plain text
      .trim();
  };

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  return (
    <div className={`space-y-3 text-xs sm:text-sm leading-relaxed ${className}`}>
      {lines.map((line, idx) => {
        const isHeader = line.startsWith('#') || line.startsWith('**') && line.endsWith('**') || line.endsWith(':');
        const isBullet = line.startsWith('*') || line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line);
        const isWarning = line.toLowerCase().includes('disclaimer') || line.toLowerCase().includes('doctor') || line.toLowerCase().includes('warning') || line.toLowerCase().includes('emergency');

        const cleaned = cleanLine(line);
        if (!cleaned) return null;

        if (isWarning) {
          return (
            <div key={idx} className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-2 my-1">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="font-medium">{cleaned}</p>
            </div>
          );
        }

        if (isHeader) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800 pt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{cleaned.replace(/:$/, '')}</span>
            </h4>
          );
        }

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <p className="text-slate-800 font-medium">{cleaned}</p>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-800 font-medium">
            {cleaned}
          </p>
        );
      })}
    </div>
  );
};
