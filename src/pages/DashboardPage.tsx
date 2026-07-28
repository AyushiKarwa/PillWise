import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { MedicineCard } from '../components/MedicineCard';
import { SymptomCard } from '../components/SymptomCard';
import {
  Send,
  Sparkles,
  Scan,
  PlusCircle,
  Tag,
  Pill,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Bot,
  ArrowRight,
  ChevronDown,
  Info,
  Calendar,
  MessageSquare,
  BellRing,
  FileText
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    medicines,
    consumptionHistory,
    aiHistory,
    reminders,
    setActiveSection,
    evaluateSymptoms,
    setPriceCheckMedicine,
    handleReminderAction,
    userName,
    setShowNamePrompt
  } = useCabinet();

  const greetingName = userName.trim() ? userName.trim() : 'User';

  const [symptomInput, setSymptomInput] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [currentAiResult, setCurrentAiResult] = useState<any>(null);

  // Metrics calculation
  const totalMedicines = medicines.reduce((acc, m) => acc + (m.quantity || 1), 0); // Total tablets/quantity
  const totalItemsCount = medicines.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const expiringSoonCount = medicines.filter((m) => {
    const isExpired = m.expiryDate <= todayStr;
    const isExpiringSoon =
      !isExpired &&
      new Date(m.expiryDate).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 30; // 30 days
    return isExpired || isExpiringSoon;
  }).length;

  const lowStockCount = medicines.filter((m) => m.quantity <= m.lowStockThreshold).length;
  const scheduledTodayCount = reminders.length;

  // Taken this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const takenThisMonthCount = consumptionHistory.reduce((acc, h) => {
    const hDate = new Date(h.createdAt || h.date);
    if (hDate.getMonth() === currentMonth && hDate.getFullYear() === currentYear) {
      return acc + (h.quantityTaken || 1);
    }
    return acc;
  }, 0);

  // Category counts for Health Summary donut chart
  const tabletCount = medicines.filter((m) =>
    (m.dosage || '').toLowerCase().includes('tablet') || (m.name || '').toLowerCase().includes('tablet')
  ).reduce((a, b) => a + (b.quantity || 1), 0);

  const capsuleCount = medicines.filter((m) =>
    (m.dosage || '').toLowerCase().includes('capsule') || (m.name || '').toLowerCase().includes('cap')
  ).reduce((a, b) => a + (b.quantity || 1), 0);

  const syrupCount = medicines.filter((m) =>
    (m.dosage || '').toLowerCase().includes('syrup') || (m.dosage || '').toLowerCase().includes('ml')
  ).reduce((a, b) => a + (b.quantity || 1), 0);

  const otherCount = Math.max(0, totalMedicines - (tabletCount + capsuleCount + syrupCount));

  const handleSymptomSearchWithText = async (text: string) => {
    if (!text.trim()) return;
    setSymptomInput(text);
    setEvaluating(true);
    const result = await evaluateSymptoms(text);
    setCurrentAiResult(result);
    setEvaluating(false);
  };

  const handleSymptomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSymptomSearchWithText(symptomInput);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12 text-slate-800">
      {/* Welcome Header & Symptom Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Hello, {greetingName}! 👋</span>
              <button
                onClick={() => setShowNamePrompt(true)}
                className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                title="Edit name"
              >
                Edit
              </button>
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-0.5">
              How are you feeling today?
            </p>
          </div>

          {/* Prompt / Symptom Search Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
            <form onSubmit={handleSymptomSearch} className="relative flex items-center">
              <textarea
                rows={2}
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Describe your symptoms..."
                className="w-full pr-12 text-sm text-slate-800 placeholder:text-slate-400 border-none focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={evaluating || !symptomInput.trim()}
                className="absolute right-1 top-1 p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center shrink-0"
                title="Send symptoms to AI"
              >
                {evaluating ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-700 pt-1 border-t border-slate-100">
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                ⚡ Direct Analysis:
              </span>
              {['Fever & High Temperature', 'Headache & Migraine', 'Stomach pain', 'Cold and cough'].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleSymptomSearchWithText(ex)}
                  className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors text-xs border border-emerald-200/80 cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* AI Symptom Evaluation Result - DIRECTLY RIGHT BELOW SEARCH BOX */}
          {currentAiResult && (
            <div className="bg-emerald-50/70 border border-emerald-200/90 p-4 rounded-2xl shadow-2xs space-y-3 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ✨
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Automatic Analysis & Cabinet Match</h2>
                </div>
                <button
                  onClick={() => setCurrentAiResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs cursor-pointer"
                >
                  Dismiss Analysis
                </button>
              </div>
              <SymptomCard data={currentAiResult} querySymptoms={symptomInput} />
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setActiveSection('AI Assistant')}
              className="p-3 bg-white hover:bg-emerald-50/60 border border-slate-200/80 rounded-2xl shadow-2xs transition-all text-left flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-xs truncate">Symptom Checker</h3>
                <p className="text-[10px] text-slate-500 truncate">Get medical advice</p>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('Reminders')}
              className="p-3 bg-white hover:bg-teal-50/60 border border-slate-200/80 rounded-2xl shadow-2xs transition-all text-left flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BellRing className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-xs truncate">Reminders</h3>
                <p className="text-[10px] text-slate-500 truncate">Set & track alerts</p>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('Prescription Reader')}
              className="p-3 bg-white hover:bg-purple-50/60 border border-slate-200/80 rounded-2xl shadow-2xs transition-all text-left flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-xs truncate">Prescription Reader</h3>
                <p className="text-[10px] text-slate-500 truncate">Scan doctor notes</p>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('Scan Medicine')}
              className="p-3 bg-white hover:bg-sky-50/60 border border-slate-200/80 rounded-2xl shadow-2xs transition-all text-left flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Scan className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-xs truncate">Scan Box</h3>
                <p className="text-[10px] text-slate-500 truncate">Scan strip or box</p>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('Price Comparison')}
              className="p-3 bg-white hover:bg-amber-50/60 border border-slate-200/80 rounded-2xl shadow-2xs transition-all text-left flex items-center gap-2.5 group cursor-pointer col-span-2 sm:col-span-1"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Tag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-xs truncate">Compare Prices</h3>
                <p className="text-[10px] text-slate-500 truncate">Find best deals</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Side: Today's Reminders Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Today's Reminders</h3>
            <button
              onClick={() => setActiveSection('Reminders')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No reminders set for today</p>
              <button
                onClick={() => setActiveSection('Reminders')}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold rounded-lg transition-colors"
              >
                + Add Reminder
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.slice(0, 3).map((rem) => (
                <div
                  key={rem._id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={rem.completed}
                      onChange={() => handleReminderAction(rem._id, rem.completed ? 'reset' : 'taken')}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                    <div>
                      <p className={`font-bold ${rem.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {rem.medicineName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {rem.dosageToTake || 1} dose - {rem.timings}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                    rem.completed ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {rem.timeString || '08:00 AM'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5 Metric Summary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Medicines Stored */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-medium truncate">Medicines Stored</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{totalItemsCount}</p>
            <p className="text-[10px] text-slate-400">Total medicines</p>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-medium truncate">Expiring Soon</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{expiringSoonCount}</p>
            <p className="text-[10px] text-slate-400">Within 30 days</p>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-medium truncate">Low Stock</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{lowStockCount}</p>
            <p className="text-[10px] text-slate-400">Need restocking</p>
          </div>
        </div>

        {/* Reminders Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-medium truncate">Reminders Today</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{scheduledTodayCount}</p>
            <p className="text-[10px] text-slate-400">Scheduled today</p>
          </div>
        </div>

        {/* Taken This Month */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-medium truncate">Taken This Month</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{takenThisMonthCount}</p>
            <p className="text-[10px] text-slate-400">Total taken</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Medicine Cabinet Preview, Recent AI Searches & Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicine Cabinet Preview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Medicine Cabinet Preview</h3>
              <button
                onClick={() => setActiveSection('Medicine Cabinet')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all
              </button>
            </div>

            {medicines.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Your Cabinet is Empty</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                    Add your medicines and tablets to manage stock, expiry alerts, and daily reminders.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('Add Medicine')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                >
                  + Add New Medicine
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {medicines.slice(0, 4).map((med) => {
                  const isLow = med.quantity <= med.lowStockThreshold;
                  return (
                    <div
                      key={med._id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-emerald-600 font-bold overflow-hidden shrink-0">
                          {med.image ? (
                            <img
                              src={med.image}
                              alt={med.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Pill className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs line-clamp-1">{med.name}</p>
                          <p className="text-[11px] text-slate-500">{med.salt || med.dosage}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-700">{med.quantity} tablets</span>
                        <p className="text-[10px] text-slate-400">Exp: {med.expiryDate}</p>
                        <span className={`inline-block px-2 py-0.5 mt-0.5 rounded-full text-[9px] font-bold ${
                          isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveSection('Medicine Cabinet')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            <span>Go to Medicine Cabinet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent AI Searches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Recent AI Searches</h3>
              <button
                onClick={() => setActiveSection('History')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all
              </button>
            </div>

            {aiHistory.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">No AI Search History</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                    Search any symptoms in the box above to get instant cabinet-matched guidance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {aiHistory.slice(0, 4).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 line-clamp-1">{item.symptoms}</p>
                        <p className="text-[10px] text-slate-400">AI Guided</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Recently</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveSection('AI Assistant')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Health Summary (Donut Chart Analytics) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">Health Summary</h3>
              <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-medium cursor-pointer">
                <span>This Month</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Circular Donut Graphic */}
            <div className="py-4 flex flex-col items-center justify-center relative">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Donut */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {totalMedicines > 0 ? (
                    <>
                      {tabletCount > 0 && (
                        <path
                          className="text-emerald-500"
                          strokeDasharray={`${(tabletCount / totalMedicines) * 100}, 100`}
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      )}
                      {capsuleCount > 0 && (
                        <path
                          className="text-sky-500"
                          strokeDasharray={`${(capsuleCount / totalMedicines) * 100}, 100`}
                          strokeDashoffset={`-${(tabletCount / totalMedicines) * 100}`}
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      )}
                      {syrupCount > 0 && (
                        <path
                          className="text-purple-500"
                          strokeDasharray={`${(syrupCount / totalMedicines) * 100}, 100`}
                          strokeDashoffset={`-${((tabletCount + capsuleCount) / totalMedicines) * 100}`}
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      )}
                      {otherCount > 0 && (
                        <path
                          className="text-amber-500"
                          strokeDasharray={`${(otherCount / totalMedicines) * 100}, 100`}
                          strokeDashoffset={`-${((tabletCount + capsuleCount + syrupCount) / totalMedicines) * 100}`}
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      )}
                    </>
                  ) : (
                    /* When total is 0, render a single uniform clean ring */
                    <path
                      className="text-emerald-500/25"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  )}
                </svg>

                {/* Center Number */}
                <div className="absolute text-center">
                  <p className="text-2xl font-black text-slate-900">{totalMedicines}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</p>
                </div>
              </div>

              {/* Legend List */}
              <div className="w-full grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-slate-600">
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Tablets</span>
                  </div>
                  <span className="font-bold text-slate-900">{tabletCount}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span>Capsules</span>
                  </div>
                  <span className="font-bold text-slate-900">{capsuleCount}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Syrups</span>
                  </div>
                  <span className="font-bold text-slate-900">{syrupCount}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Others</span>
                  </div>
                  <span className="font-bold text-slate-900">{otherCount}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveSection('Medicine Cabinet')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            <span>View Detailed Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer Medical Disclaimer (Matching Reference Template) */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-6 border-t border-slate-200/80 text-center">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <p>
          <span className="font-semibold text-slate-700">Disclaimer:</span> This is not medical advice. Please consult a healthcare professional before taking any medication.
        </p>
      </div>
    </div>
  );
};
