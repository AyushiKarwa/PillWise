import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { MedicineAutocomplete } from '../components/MedicineAutocomplete';
import { findPopularMedicineInfo } from '../data/medicineDatabase';
import { PlusCircle, Pill, Upload, Star, Check, ArrowLeft, Camera } from 'lucide-react';

export const AddMedicinePage: React.FC = () => {
  const { addMedicine, setActiveSection, showToast } = useCabinet();

  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    dosage: '1 tablet daily',
    formType: 'Tablet' as 'Tablet' | 'Capsule' | 'Syrup' | 'Ointment' | 'Cream' | 'Gel' | 'Drops' | 'Injection' | 'Other',
    quantity: 10,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    salt: '',
    image: '',
    favorite: false,
    lowStockThreshold: 1
  });

  const isTopicalOintment = formData.formType === 'Ointment' || formData.formType === 'Cream' || formData.formType === 'Gel';

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Medicine name is required', 'warning');
      return;
    }

    setSubmitting(true);
    const added = await addMedicine(formData);
    setSubmitting(false);

    if (added) {
      setActiveSection('Medicine Cabinet');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in pb-12">
      <BackButtonHeader title="Add Medicine" subtitle="Cabinet Inventory" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setActiveSection('Medicine Cabinet')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Cabinet
          </button>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            Add New Medicine
          </h1>
          <p className="text-xs text-slate-500">
            Save medicine details, expiration date, and stock count to your cabinet.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-5"
      >
        {/* Name & Salt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medicine Name <span className="text-rose-500">*</span>
            </label>
            <MedicineAutocomplete
              required
              value={formData.name}
              onChange={(val) => {
                const pop = findPopularMedicineInfo(val);
                setFormData((prev) => ({
                  ...prev,
                  name: val,
                  purpose: pop ? pop.purpose : prev.purpose,
                  dosage: pop ? pop.defaultDosage : prev.dosage
                }));
              }}
              onSelect={(med) => {
                setFormData((prev) => ({
                  ...prev,
                  name: med.name,
                  purpose: med.purpose || prev.purpose,
                  dosage: med.defaultDosage || prev.dosage
                }));
              }}
              placeholder="e.g. Dolo 650, Crocin, Cetirizine"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Salt / Chemical Active Ingredient
            </label>
            <input
              type="text"
              value={formData.salt}
              onChange={(e) => setFormData({ ...formData, salt: e.target.value })}
              placeholder="e.g. Paracetamol 650mg"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Medicine Form Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Medicine Form / Type
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { type: 'Tablet', label: '💊 Tablet' },
              { type: 'Capsule', label: '💊 Capsule' },
              { type: 'Syrup', label: '🧴 Syrup' },
              { type: 'Ointment', label: '🧴 Ointment / Cream' },
              { type: 'Drops', label: '💧 Drops' },
              { type: 'Other', label: '📦 Other' }
            ].map((item) => (
              <button
                type="button"
                key={item.type}
                onClick={() => {
                  const newType = item.type as any;
                  const isOint = newType === 'Ointment' || newType === 'Cream';
                  setFormData((prev) => ({
                    ...prev,
                    formType: newType,
                    dosage: isOint ? 'Apply topically on skin as needed' : prev.dosage === 'Apply topically on skin as needed' ? '1 tablet daily' : prev.dosage,
                    quantity: isOint && prev.quantity > 5 ? 1 : prev.quantity
                  }));
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  formData.formType === item.type
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Purpose / Common Indication
          </label>
          <input
            type="text"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder={isTopicalOintment ? 'e.g. Dry skin, burns, antiseptic healing (Boroline)' : 'e.g. Fever reduction and headache relief'}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 font-medium"
          />
        </div>

        {/* Dosage, Quantity, Expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isTopicalOintment ? 'Application Instructions' : 'Dosage Instructions'}
            </label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder={isTopicalOintment ? 'e.g. Apply twice daily on affected area' : 'e.g. 1 tablet every 6 hrs'}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isTopicalOintment ? 'Tubes / Containers Available' : 'Initial Quantity (Units/Tablets)'}
            </label>
            <input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expiry Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Low Stock Threshold & Favorite Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">Alert triggered when stock reaches or drops below this count.</p>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            <label className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={formData.favorite}
                onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <Star className={`w-4 h-4 ${formData.favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                Mark as Favorite ⭐
              </span>
            </label>
          </div>
        </div>

        {/* Medicine Photo / Image */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Medicine Image Photo
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {formData.image ? (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 text-[10px]"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="w-full sm:w-auto px-4 py-3 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 transition-colors">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Upload Box Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}

            <div className="flex-1 w-full">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Or paste an image URL..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setActiveSection('Medicine Cabinet')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save to Medicine Cabinet'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
