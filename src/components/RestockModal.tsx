import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { X, Plus, Pill } from 'lucide-react';

export const RestockModal: React.FC = () => {
  const { selectedMedicineForRestock, setSelectedMedicineForRestock, restockMedicine } = useCabinet();
  const [restockAmount, setRestockAmount] = useState<number>(10);

  if (!selectedMedicineForRestock) return null;

  const m = selectedMedicineForRestock;

  const handleRestock = async () => {
    await restockMedicine(m._id, restockAmount);
    setSelectedMedicineForRestock(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Restock Medicine Stock</h3>
              <p className="text-xs text-slate-500">{m.name}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedMedicineForRestock(null)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-700 flex justify-between items-center">
            <span>Current Stock</span>
            <span className="font-bold text-slate-900 text-sm">{m.quantity} units</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity Purchased / Added
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRestockAmount((q) => Math.max(1, q - 5))}
                className="w-10 h-10 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 text-lg"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(Math.max(1, Number(e.target.value)))}
                className="w-full text-center py-2 border border-slate-200 rounded-xl font-bold text-lg text-slate-800 focus:outline-teal-500"
              />
              <button
                type="button"
                onClick={() => setRestockAmount((q) => q + 5)}
                className="w-10 h-10 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 text-lg"
              >
                +5
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            {[5, 10, 15, 20].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setRestockAmount(preset)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  restockAmount === preset
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                +{preset}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedMedicineForRestock(null)}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleRestock}
            className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Confirm Restock (+{restockAmount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
