import React, { useState, useEffect, useRef } from 'react';
import { POPULAR_MEDICINES_DATA, PopularMedicine } from '../data/medicineDatabase';
import { useCabinet } from '../context/CabinetContext';
import { Pill, Sparkles, Check } from 'lucide-react';

interface MedicineAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (med: PopularMedicine | { name: string; purpose?: string; defaultDosage?: string }) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const MedicineAutocomplete: React.FC<MedicineAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Type medicine name...',
  className = '',
  required = false
}) => {
  const { medicines } = useCabinet();
  const [suggestions, setSuggestions] = useState<Array<{ name: string; purpose?: string; dosage?: string; source: 'cabinet' | 'database' }>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions in real time
  useEffect(() => {
    const query = value.trim().toLowerCase();
    if (!query) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const matches: Array<{ name: string; purpose?: string; dosage?: string; source: 'cabinet' | 'database' }> = [];

    // 1. Cabinet Medicines first
    medicines.forEach((m) => {
      if (m.name.toLowerCase().includes(query)) {
        matches.push({
          name: m.name,
          purpose: m.purpose,
          dosage: m.dosage,
          source: 'cabinet'
        });
      }
    });

    // 2. Popular Database Medicines
    Object.values(POPULAR_MEDICINES_DATA).forEach((pop) => {
      if (
        pop.name.toLowerCase().includes(query) &&
        !matches.some((m) => m.name.toLowerCase() === pop.name.toLowerCase())
      ) {
        matches.push({
          name: pop.name,
          purpose: pop.purpose,
          dosage: pop.defaultDosage,
          source: 'database'
        });
      }
    });

    setSuggestions(matches.slice(0, 7));
    setIsOpen(matches.length > 0);
  }, [value, medicines]);

  const handleSelect = (item: { name: string; purpose?: string; dosage?: string }) => {
    onChange(item.name);
    setIsOpen(false);
    if (onSelect) {
      onSelect({
        name: item.name,
        purpose: item.purpose,
        defaultDosage: item.dosage
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.trim().length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className={className}
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-emerald-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Suggestions Matching "{value}"</span>
            <Sparkles className="w-3 h-3 text-emerald-500" />
          </div>

          <div className="divide-y divide-slate-100">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full px-3.5 py-2.5 text-left hover:bg-emerald-50 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-900">
                      {s.name}
                    </span>
                    {s.source === 'cabinet' && (
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                        In Cabinet
                      </span>
                    )}
                  </div>
                  {s.purpose && (
                    <p className="text-[11px] text-slate-500 group-hover:text-emerald-700 mt-0.5">
                      Purpose: {s.purpose}
                    </p>
                  )}
                </div>

                <Check className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
