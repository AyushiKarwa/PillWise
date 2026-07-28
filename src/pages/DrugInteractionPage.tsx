import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { ShieldAlert, Plus, Trash2, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

export const DrugInteractionPage: React.FC = () => {
  const { medicines, checkInteractions, showToast } = useCabinet();

  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState<string>('');
  const [checking, setChecking] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const toggleSelectMedicine = (name: string) => {
    if (selectedList.includes(name)) {
      setSelectedList(selectedList.filter((item) => item !== name));
    } else {
      setSelectedList([...selectedList, name]);
    }
  };

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    if (!selectedList.includes(customInput.trim())) {
      setSelectedList([...selectedList, customInput.trim()]);
    }
    setCustomInput('');
  };

  const handleRunCheck = async () => {
    if (selectedList.length < 2) {
      showToast('Select at least 2 medicines to check interactions', 'warning');
      return;
    }

    setChecking(true);
    setResult(null);

    const res = await checkInteractions(selectedList);
    setChecking(false);

    if (res) {
      setResult(res);
      showToast('Drug interaction analysis complete', 'success');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in pb-12">
      <BackButtonHeader title="Drug Interactions" subtitle="Safety Checker" />
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          Drug Interaction Checker
        </h1>
        <p className="text-xs text-slate-500">
          Select 2 or more medicines from your cabinet or enter custom drugs to verify safety and prevent harmful interactions.
        </p>
      </div>

      {/* Select Cabinet Medicines */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">1. Select Medicines to Compare</h3>

        {/* Cabinet Chips */}
        <div className="flex flex-wrap gap-2">
          {medicines.map((m) => {
            const isSelected = selectedList.includes(m.name);
            return (
              <button
                key={m._id}
                onClick={() => toggleSelectMedicine(m.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{m.name}</span>
                {isSelected ? '✓' : '+'}
              </button>
            );
          })}
        </div>

        {/* Custom Drug Input */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Or type a custom drug name (e.g. Aspirin)..."
            className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-rose-500"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Add Drug
          </button>
        </div>

        {/* Currently Selected Box */}
        {selectedList.length > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-slate-600">Selected for Analysis ({selectedList.length}):</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedList.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 bg-white text-rose-800 border border-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <span>{item}</span>
                  <button onClick={() => toggleSelectMedicine(item)} className="text-rose-400 hover:text-rose-700">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleRunCheck}
          disabled={checking || selectedList.length < 2}
          className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
        >
          {checking ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Evaluating Pharmacology & Safety...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Check Interaction Safety</span>
            </>
          )}
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-base">Interaction Safety Evaluation</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.hasInteraction
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              Risk: {result.severity || (result.hasInteraction ? 'Moderate' : 'Safe')}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-800 space-y-2 leading-relaxed">
            <p className="font-semibold text-slate-900">Summary:</p>
            <p>{result.summary}</p>
          </div>

          {result.details && result.details.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Findings</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.details.map((d: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900">
            <strong>Medical Disclaimer:</strong> Always double check with your treating physician or pharmacist before combining new medications.
          </div>
        </div>
      )}
    </div>
  );
};
