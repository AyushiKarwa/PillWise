import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { X, CheckCircle, SkipForward, Pill, Clock } from 'lucide-react';

export const ConsumeModal: React.FC = () => {
  const { selectedMedicineForConsume, setSelectedMedicineForConsume, consumeMedicine } = useCabinet();
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('Confirmed intake');

  if (!selectedMedicineForConsume) return null;

  const m = selectedMedicineForConsume;

  const handleConfirm = async () => {
    await consumeMedicine(m._id, quantity, notes);
    setSelectedMedicineForConsume(null);
  };

  const handleSkip = () => {
    setSelectedMedicineForConsume(null);
  };

  const isOintment = m.formType === 'Ointment' || m.formType === 'Cream' || m.formType === 'Gel' || /boroline|volini|moov|betadine|cream|ointment/i.test(m.name);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {isOintment ? <span className="text-xl">🧴</span> : <Pill className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                {isOintment ? 'Record Ointment Application' : 'Confirm Medicine Intake'}
              </h3>
              <p className="text-xs text-slate-500">{m.name}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedMedicineForConsume(null)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-800">
            <p className="font-semibold mb-1">
              {isOintment
                ? `Cabinet Stock: ${m.quantity} ${m.quantity === 1 ? 'Tube' : 'Tubes'} available`
                : `Current Cabinet Stock: ${m.quantity} units`}
            </p>
            <p className="text-emerald-700">Dosage guidance: {m.dosage}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isOintment ? 'Applications / Units Used' : 'Quantity Taken (Units)'}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 text-lg cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={m.quantity || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full text-center py-2 border border-slate-200 rounded-xl font-bold text-lg text-slate-800 focus:outline-emerald-500"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(m.quantity || 99, q + 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 text-lg cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Optional Note / Reason
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isOintment ? 'e.g. Applied for dry skin / cut healing' : 'e.g. Took for mild headache'}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4 text-slate-500" />
            <span>Skip</span>
          </button>

          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isOintment ? 'I Applied This' : 'I Took This Medicine'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
