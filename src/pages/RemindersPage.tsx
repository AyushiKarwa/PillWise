import React, { useState, useMemo, useCallback } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { ClockTimePicker } from '../components/ClockTimePicker';
import { MedicineAutocomplete } from '../components/MedicineAutocomplete';
import { findPopularMedicineInfo } from '../data/medicineDatabase';
import {
  BellRing,
  Plus,
  Clock,
  Pill,
  Trash2,
  Repeat,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  Calendar,
  Sparkles,
  HelpCircle,
  PackagePlus,
  Info,
  Edit3,
  Volume2,
  Mic,
  Play
} from 'lucide-react';

const POPULAR_MEDICINES = [
  'Dolo 650',
  'Paracetamol 500mg',
  'Crocin 650',
  'Pantocid 40mg',
  'Cetirizine 10mg',
  'Combiflam',
  'Azithromycin 500mg',
  'Ibuprofen 400mg',
  'Allegra 120mg',
  'Disprin',
  'Zincovit',
  'Limcee Vitamin C',
  'Electral ORS',
  'Gelusil Antacid'
];

const REPEAT_OPTIONS = [
  'Daily (Every day)',
  'Twice Daily (Morning & Evening)',
  'Every 8 Hours',
  'Weekdays (Mon-Fri)',
  'Weekly',
  'As Needed (PRN)'
];

export const RemindersPage: React.FC = () => {
  const {
    reminders,
    medicines,
    toggleReminder,
    addReminder,
    updateReminder,
    deleteReminder,
    setSelectedMedicineForConsume,
    setActiveSection,
    setSelectedMedicineForEdit,
    triggerTestAlarm,
    setIsRingtoneModalOpen,
    customVoiceUrl
  } = useCabinet();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [newReminder, setNewReminder] = useState({
    medicineName: '',
    time: '09:00 AM',
    dosage: '1 tablet after meals',
    purpose: 'Fever & Pain relief',
    repeat: 'Daily (Every day)',
    notes: 'Take with full glass of water'
  });

  const openAddModal = () => {
    setEditingId(null);
    setNewReminder({
      medicineName: '',
      time: '09:00 AM',
      dosage: '1 tablet after meals',
      purpose: 'Fever & Pain relief',
      repeat: 'Daily (Every day)',
      notes: 'Take with full glass of water'
    });
    setShowAddModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item._id);
    setNewReminder({
      medicineName: item.medicineName || '',
      time: item.time || item.timeString || '09:00 AM',
      dosage: item.dosage || '1 tablet after meals',
      purpose: item.purpose || '',
      repeat: item.repeat || item.timings || 'Daily (Every day)',
      notes: item.notes || ''
    });
    setShowAddModal(true);
  };

  // Cabinet Match Helper
  const getCabinetMatch = (name: string) => {
    if (!name.trim()) return null;
    const target = name.toLowerCase().trim();
    return medicines.find(
      (m) =>
        m.name.toLowerCase().trim() === target ||
        m.name.toLowerCase().includes(target)
    ) || null;
  };

  const currentMatch = useMemo(
    () => getCabinetMatch(newReminder.medicineName),
    [newReminder.medicineName, medicines]
  );

  const handleTimeChange = useCallback((formattedTime: string) => {
    setNewReminder((prev) => ({ ...prev, time: formattedTime }));
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.medicineName.trim()) return;

    if (editingId) {
      await updateReminder(editingId, {
        medicineName: newReminder.medicineName.trim(),
        medicineId: currentMatch?._id || '',
        time: newReminder.time,
        timeString: newReminder.time,
        dosage: newReminder.dosage,
        purpose: newReminder.purpose,
        repeat: newReminder.repeat,
        timings: newReminder.repeat,
        notes: newReminder.notes
      });
    } else {
      await addReminder({
        medicineName: newReminder.medicineName.trim(),
        medicineId: currentMatch?._id || '',
        time: newReminder.time,
        dosage: newReminder.dosage,
        purpose: newReminder.purpose,
        repeat: newReminder.repeat,
        notes: newReminder.notes
      });
    }

    // Reset form
    setNewReminder({
      medicineName: '',
      time: '09:00 AM',
      dosage: '1 tablet after meals',
      purpose: 'Fever & Pain relief',
      repeat: 'Daily (Every day)',
      notes: 'Take with full glass of water'
    });
    setEditingId(null);
    setShowAddModal(false);
  };

  const filteredReminders = reminders.filter((r) =>
    r.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.purpose || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in pb-12">
      {/* 1. Back to Home Navigation Bar */}
      <BackButtonHeader title="Medication Reminders" subtitle="Custom Timed Dosage Alerts" />

      {/* 2. Top Banner & Add Button */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-emerald-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
            <BellRing className="w-3 h-3 text-emerald-400" /> Phone Alarm & Voice Ringtones
          </span>
          <h1 className="text-xl font-bold tracking-tight">Medication Reminders</h1>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            Rings like a phone alarm with custom speech "It's time to take medicine" or your own recorded voice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => triggerTestAlarm()}
            className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl border border-emerald-500/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-emerald-300" />
            <span>Test Phone Alarm</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRingtoneModalOpen(true)}
            className="px-3.5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl border border-purple-500/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Mic className="w-4 h-4 text-purple-300" />
            <span>{customVoiceUrl ? 'Voice Recorded ✔' : 'Record Voice Ringtone'}</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Reminder</span>
          </button>
        </div>
      </div>

      {/* 3. Search Bar */}
      {reminders.length > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search reminders by medicine name or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
          />
        </div>
      )}

      {/* 4. Unified Active Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-bold">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">No Active Reminders Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Add custom dose schedules with time, purpose, and repeat frequencies linked to your medicine cabinet inventory.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Reminder</span>
            </button>
          </div>
        ) : (
          filteredReminders.map((item) => {
            const cabinetItem = getCabinetMatch(item.medicineName);

            return (
              <div
                key={item._id}
                className={`p-4 rounded-3xl border transition-all space-y-3 ${
                  item.completed
                    ? 'bg-slate-50/80 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                {/* Main Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleReminder(item._id)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                        item.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : 'bg-white border-slate-300 text-transparent hover:border-emerald-500'
                      }`}
                      title={item.completed ? 'Mark as pending' : 'Mark dose as taken'}
                    >
                      ✓
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-bold text-sm ${
                            item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {item.medicineName}
                        </h3>

                        {/* Clock Badge */}
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{item.time || item.timeString || '09:00 AM'}</span>
                        </span>

                        {/* Repeat Badge */}
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-semibold flex items-center gap-1">
                          <Repeat className="w-3 h-3 text-slate-400" />
                          <span>{item.repeat || 'Daily'}</span>
                        </span>
                      </div>

                      {/* Purpose & Dosage */}
                      <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2 font-medium">
                        {item.dosage && <span className="font-bold text-slate-800">Dose: {item.dosage}</span>}
                        {item.purpose && <span className="text-slate-500">• Purpose: {item.purpose}</span>}
                        {item.notes && <span className="text-slate-400 text-[11px]">({item.notes})</span>}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => triggerTestAlarm(item)}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      title="Test alarm & ringtone for this medicine"
                    >
                      <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ring Alarm</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit reminder"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReminder(item._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Cabinet Connection Live Info Box */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  {cabinetItem ? (
                    <div className="flex flex-wrap items-center gap-3 bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <PackageCheck className="w-4 h-4 text-emerald-600" />
                        <span>In Cabinet:</span>
                      </div>

                      <div className="flex items-center gap-2 font-semibold text-slate-700 text-[11px]">
                        <span className="px-2 py-0.5 bg-white rounded-md border border-emerald-200 text-emerald-800 font-extrabold">
                          📦 {cabinetItem.quantity} Left
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> Expiry: {cabinetItem.expiryDate}
                        </span>
                      </div>

                      {cabinetItem.quantity <= cabinetItem.lowStockThreshold && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          ⚠️ Low Stock
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 w-full text-slate-600">
                      <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Not in Cabinet inventory yet</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMedicineForEdit({
                            _id: '',
                            name: item.medicineName,
                            quantity: 10,
                            dosage: item.dosage || '1 tablet',
                            expiryDate: '2027-12-31',
                            purpose: item.purpose || 'General Use',
                            favorite: false,
                            lowStockThreshold: 3
                          });
                          setActiveSection('Add Medicine');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <PackagePlus className="w-3.5 h-3.5" />
                        <span>+ Add to Cabinet</span>
                      </button>
                    </div>
                  )}

                  {cabinetItem && !item.completed && (
                    <button
                      type="button"
                      onClick={() => setSelectedMedicineForConsume(cabinetItem)}
                      className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Take Dose Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingId ? 'Edit Medication Reminder' : 'Add Custom Dose Reminder'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure medicine name, time, dose & repeat rule</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* A. Medicine Name Input + Popular Suggestions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Medicine Name <span className="text-rose-500">*</span>
              </label>

              <MedicineAutocomplete
                required
                value={newReminder.medicineName}
                onChange={(val) => {
                  const pop = findPopularMedicineInfo(val);
                  setNewReminder((prev) => ({
                    ...prev,
                    medicineName: val,
                    purpose: pop ? pop.purpose : prev.purpose,
                    dosage: pop ? pop.defaultDosage : prev.dosage
                  }));
                }}
                onSelect={(med) => {
                  setNewReminder((prev) => ({
                    ...prev,
                    medicineName: med.name,
                    purpose: med.purpose || prev.purpose,
                    dosage: med.defaultDosage || prev.dosage
                  }));
                }}
                placeholder="Type medicine name (e.g. Dolo 650, Pantocid)..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
              />

              {/* Popular Medicines Badges */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Popular Medicines & Cabinet Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100 custom-scrollbar">
                  {/* Cabinet medicines first */}
                  {medicines.map((m) => (
                    <button
                      key={m._id}
                      type="button"
                      onClick={() =>
                        setNewReminder({
                          ...newReminder,
                          medicineName: m.name,
                          dosage: m.dosage || newReminder.dosage,
                          purpose: m.purpose || newReminder.purpose
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                        newReminder.medicineName.toLowerCase() === m.name.toLowerCase()
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      <span>📦 {m.name}</span>
                    </button>
                  ))}

                  {/* Popular preset list */}
                  {POPULAR_MEDICINES.map((pMed) => {
                    const popInfo = findPopularMedicineInfo(pMed);
                    return (
                      <button
                        key={pMed}
                        type="button"
                        onClick={() =>
                          setNewReminder({
                            ...newReminder,
                            medicineName: pMed,
                            purpose: popInfo ? popInfo.purpose : newReminder.purpose,
                            dosage: popInfo ? popInfo.defaultDosage : newReminder.dosage
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          newReminder.medicineName.toLowerCase() === pMed.toLowerCase()
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pMed}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cabinet Live Info Preview */}
              {currentMatch ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Connected to Cabinet: {currentMatch.name}</p>
                      <p className="text-[11px] text-emerald-700">
                        {currentMatch.quantity} units left • Expiry: {currentMatch.expiryDate}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold">
                    In Cabinet
                  </span>
                </div>
              ) : newReminder.medicineName.trim() ? (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Medicine not yet in cabinet inventory.</span>
                  <span className="text-amber-700 font-bold">Will show as "Not in Cabinet"</span>
                </div>
              ) : null}
            </div>

            {/* B. Clock Time Picker Component */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Reminder Time <span className="text-rose-500">*</span>
              </label>
              <ClockTimePicker
                value={newReminder.time}
                onChange={handleTimeChange}
              />
            </div>

            {/* C. Dose & Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Tablet, 5ml syrup"
                  value={newReminder.dosage}
                  onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Purpose / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Fever, Headache, BP, Allergy"
                  value={newReminder.purpose}
                  onChange={(e) => setNewReminder({ ...newReminder, purpose: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* D. Repeat Frequency */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Repeat Frequency</label>
              <select
                value={newReminder.repeat}
                onChange={(e) => setNewReminder({ ...newReminder, repeat: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {REPEAT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    🔁 {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* E. Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Notes / Instructions</label>
              <input
                type="text"
                placeholder="e.g. Take with warm water after food"
                value={newReminder.notes}
                onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit & Cancel */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20"
              >
                {editingId ? 'Update Reminder' : 'Save Reminder'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
