import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { X, Pill, Shield, AlertTriangle, RefreshCw, Calendar, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';

export const MedicineDetailModal: React.FC = () => {
  const {
    selectedMedicineForDetail,
    setSelectedMedicineForDetail,
    setSelectedMedicineForConsume,
    setSelectedMedicineForRestock,
    toggleFavorite,
    setActiveSection,
    setPriceCheckMedicine
  } = useCabinet();

  if (!selectedMedicineForDetail) return null;

  const m = selectedMedicineForDetail;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-emerald-50/60 to-teal-50/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{m.name}</h3>
                {m.favorite && <span className="text-amber-500 font-bold">⭐</span>}
              </div>
              <p className="text-xs font-semibold text-emerald-700">{m.salt || 'Active Pharmaceutical Ingredient'}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedMedicineForDetail(null)}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm text-slate-700">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
              <p className="text-[11px] font-medium text-slate-500">Remaining</p>
              <p className="text-base font-bold text-slate-800">{m.quantity} units</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
              <p className="text-[11px] font-medium text-slate-500">Dosage</p>
              <p className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{m.dosage}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
              <p className="text-[11px] font-medium text-slate-500">Expiry Date</p>
              <p className="text-xs font-semibold text-slate-800 mt-1">{m.expiryDate}</p>
            </div>
          </div>

          {/* Uses */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Primary Uses
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(m.uses && m.uses.length > 0 ? m.uses : [m.purpose || 'General medical use']).map((use, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-100">
                  • {use}
                </span>
              ))}
            </div>
          </div>

          {/* Storage Instructions */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              Storage Instructions
            </h4>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              {m.storageInfo || 'Store in a cool, dry place away from direct heat, sunlight, and moisture.'}
            </p>
          </div>

          {/* Precautions */}
          {m.precautions && m.precautions.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Precautions & Warnings
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                {m.precautions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternatives */}
          {m.alternatives && m.alternatives.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Common Brand Alternatives</h4>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {m.alternatives.map((alt, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              toggleFavorite(m._id);
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {m.favorite ? '⭐ Favorited' : '☆ Favorite'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPriceCheckMedicine(m.name);
                setSelectedMedicineForDetail(null);
                setActiveSection('Price Comparison');
              }}
              className="px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Compare Prices
            </button>

            <button
              onClick={() => {
                const target = m;
                setSelectedMedicineForDetail(null);
                setSelectedMedicineForRestock(target);
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors"
            >
              Restock
            </button>

            <button
              onClick={() => {
                const target = m;
                setSelectedMedicineForDetail(null);
                setSelectedMedicineForConsume(target);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              Record Intake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
