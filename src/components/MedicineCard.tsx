import React from 'react';
import { Medicine } from '../types';
import { useCabinet } from '../context/CabinetContext';
import { Star, AlertTriangle, Calendar, Pill, CheckCircle, Plus, Eye, Trash2, Tag } from 'lucide-react';

export const MedicineCard: React.FC<{ medicine: Medicine }> = ({ medicine }) => {
  const {
    toggleFavorite,
    deleteMedicine,
    setSelectedMedicineForDetail,
    setSelectedMedicineForConsume,
    setSelectedMedicineForRestock,
    setActiveSection,
    setPriceCheckMedicine
  } = useCabinet();

  const isLowStock = medicine.quantity <= medicine.lowStockThreshold;

  // Check expiry
  const today = new Date().toISOString().split('T')[0];
  const isExpired = medicine.expiryDate <= today;
  const isExpiringSoon = !isExpired && new Date(medicine.expiryDate).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 60; // 60 days

  const isOintment = medicine.formType === 'Ointment' || medicine.formType === 'Cream' || medicine.formType === 'Gel' || /boroline|volini|moov|betadine|cream|ointment|tube/i.test(medicine.name);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Banner Badges */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold">
              {medicine.image ? (
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : isOintment ? (
                <span className="text-lg">🧴</span>
              ) : (
                <Pill className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-1">
                {medicine.name}
              </h3>
              {medicine.salt && (
                <p className="text-[11px] font-medium text-slate-500 line-clamp-1">
                  {medicine.salt}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(medicine._id)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-amber-400 transition-colors"
            title={medicine.favorite ? 'Remove from Favorites' : 'Mark as Favorite'}
          >
            <Star
              className={`w-4 h-4 ${
                medicine.favorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {/* Quantity Badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
              medicine.quantity === 0
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : isLowStock
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isOintment ? (
              <>
                <span className="text-xs">🧴</span>
                <span>
                  {medicine.quantity === 0
                    ? 'Out of Stock'
                    : `In Stock (${medicine.quantity} ${medicine.quantity === 1 ? 'Tube' : 'Tubes'})`}
                </span>
              </>
            ) : (
              <>
                <Pill className="w-3 h-3" />
                <span>{medicine.quantity} remaining</span>
              </>
            )}
          </span>

          {/* Expiry Badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${
              isExpired
                ? 'bg-rose-100 text-rose-700'
                : isExpiringSoon
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>
              {isExpired
                ? 'Expired'
                : isExpiringSoon
                ? `Expiring: ${medicine.expiryDate}`
                : `Exp: ${medicine.expiryDate}`}
            </span>
          </span>
        </div>

        {/* Purpose / Dosage info */}
        {medicine.purpose && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-2 font-normal leading-relaxed">
            {medicine.purpose}
          </p>
        )}

        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
          {isOintment ? 'Application: ' : 'Dosage: '}<span className="text-slate-700">{medicine.dosage}</span>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-1">
        {/* Consume / Take Button */}
        <button
          onClick={() => setSelectedMedicineForConsume(medicine)}
          disabled={medicine.quantity <= 0}
          className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{isOintment ? 'I Applied This' : 'I Took This'}</span>
        </button>

        {/* Restock Button */}
        <button
          onClick={() => setSelectedMedicineForRestock(medicine)}
          className="p-1.5 bg-white border border-slate-200/80 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          title="Restock medicine count"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Compare price if low stock */}
        {isLowStock && (
          <button
            onClick={() => {
              setPriceCheckMedicine(medicine.name);
              setActiveSection('Price Comparison');
            }}
            className="p-1.5 bg-amber-50 border border-amber-200/80 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-medium transition-colors"
            title="Compare Online Prices"
          >
            <Tag className="w-4 h-4" />
          </button>
        )}

        {/* Detail Modal Trigger */}
        <button
          onClick={() => setSelectedMedicineForDetail(medicine)}
          className="p-1.5 bg-white border border-slate-200/80 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          title="View Medicine Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Delete button */}
        <button
          onClick={() => deleteMedicine(medicine._id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete from Cabinet"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
