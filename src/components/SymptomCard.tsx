import React from 'react';
import { AiStructuredResponse } from '../types';
import { useCabinet } from '../context/CabinetContext';
import { CheckCircle2, AlertTriangle, Home, ShoppingBag, ShieldAlert, Pill, ArrowRight, Tag } from 'lucide-react';

export const SymptomCard: React.FC<{ data: AiStructuredResponse; querySymptoms?: string }> = ({
  data,
  querySymptoms
}) => {
  const { medicines, setSelectedMedicineForConsume, setActiveSection, setPriceCheckMedicine } = useCabinet();

  if (!data) return null;

  const matchedCabinetItem = medicines.length > 0
    ? medicines.find((m) =>
        data.availableMedicine?.name
          ? m.name.toLowerCase().includes(data.availableMedicine.name.toLowerCase()) ||
            data.availableMedicine.name.toLowerCase().includes(m.name.toLowerCase())
          : false
      )
    : null;

  const isAvailableInCabinet = Boolean(data.availableMedicine?.matched && medicines.length > 0 && matchedCabinetItem);
  const needToBuy = !isAvailableInCabinet;

  const cleanText = (str: string) => (str || '').replace(/[\*#_]+/g, '').trim();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden space-y-6 p-6 transition-all animate-in fade-in">
      {/* Search Header */}
      {querySymptoms && (
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              AI Health Guidance
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">"{querySymptoms}"</h3>
          </div>
        </div>
      )}

      {/* 1. Health Summary & Possible Causes */}
      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Possible Causes (Educational Context)
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.possibleCause?.map((cause, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-white text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs"
            >
              • {cleanText(cause)}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Medicine Available in Cabinet */}
      {isAvailableInCabinet && matchedCabinetItem ? (
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Medicine Available in Cabinet</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
              ✔ Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-emerald-100 mb-3 text-xs">
            <div>
              <p className="text-[10px] font-medium text-slate-400">Medicine Name</p>
              <p className="font-bold text-slate-900 text-sm">{matchedCabinetItem.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400">Cabinet Quantity</p>
              <p className="font-bold text-emerald-700">{matchedCabinetItem.quantity} {matchedCabinetItem.formType === 'Ointment' || matchedCabinetItem.formType === 'Cream' || matchedCabinetItem.formType === 'Gel' ? 'Tubes' : 'units'}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400">Expiry Date</p>
              <p className="font-semibold text-slate-700">{matchedCabinetItem.expiryDate || 'Valid'}</p>
            </div>
          </div>

          {matchedCabinetItem.purpose && (
            <p className="text-xs text-slate-700 mb-3 leading-relaxed">
              <span className="font-semibold">Common Use:</span> {matchedCabinetItem.purpose}
            </p>
          )}

          <button
            onClick={() => setSelectedMedicineForConsume(matchedCabinetItem)}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Pill className="w-4 h-4" />
            <span>Record Using {matchedCabinetItem.name}</span>
          </button>
        </div>
      ) : (
        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium text-slate-800">No matching medicine found in your home cabinet.</span>
          </div>
          <button
            onClick={() => {
              const medToSearch = data.otcOptions?.[0]?.name || data.availableMedicine?.name || 'Dolo 650';
              setPriceCheckMedicine(medToSearch);
              setActiveSection('Price Comparison');
            }}
            className="font-bold text-amber-900 bg-amber-200/90 hover:bg-amber-300 px-3 py-1.5 rounded-full text-[11px] border border-amber-300 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            <span>Need To Buy: YES (Compare Prices)</span>
            <Tag className="w-3.5 h-3.5 text-amber-900" />
          </button>
        </div>
      )}

      {/* 3. Home Care */}
      {data.homeCare && data.homeCare.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Home className="w-4 h-4 text-emerald-600" />
            Home Care Guidance
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {data.homeCare.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{cleanText(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Doctor Warning */}
      {data.doctorWarning && data.doctorWarning.length > 0 && (
        <div className="p-4 bg-rose-50/80 border border-rose-200/80 rounded-2xl">
          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Consult a Doctor Immediately If:
          </h4>
          <ul className="space-y-1 text-xs text-rose-900">
            {data.doctorWarning.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span>{cleanText(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Common OTC Options (if need to buy) */}
      {data.otcOptions && data.otcOptions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Common OTC Options
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">Non-Prescription</span>
          </div>
          <div className="space-y-2">
            {data.otcOptions.map((otc, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-bold text-slate-900">{otc.name}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">{otc.purpose} • {otc.generalDosage}</p>
                </div>
                <button
                  onClick={() => {
                    setPriceCheckMedicine(otc.name);
                    setActiveSection('Price Comparison');
                  }}
                  className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold text-[11px] flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-teal-600" />
                  Compare Price
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Need to Buy Indicator */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500">Need To Buy New Stock:</span>
        {needToBuy ? (
          <button
            onClick={() => {
              const medToSearch = data.otcOptions?.[0]?.name || data.availableMedicine?.name || 'Dolo 650';
              setPriceCheckMedicine(medToSearch);
              setActiveSection('Price Comparison');
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>✔ YES (Purchase OTC & Compare Prices)</span>
            <Tag className="w-3.5 h-3.5 text-white" />
          </button>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ❌ NO (Available in Cabinet)
          </span>
        )}
      </div>

      {/* 7. Disclaimer */}
      <div className="p-3 bg-slate-100/70 rounded-xl text-[11px] text-slate-500 leading-relaxed font-medium text-center">
        {data.disclaimer}
      </div>
    </div>
  );
};
