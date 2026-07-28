import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { BackButtonHeader } from '../components/BackButtonHeader';
import {
  FileText,
  Camera,
  Upload,
  Sparkles,
  Check,
  Plus,
  Pill,
  ShieldCheck,
  AlertTriangle,
  Activity,
  BellRing,
  FlaskConical,
  Clock,
  Stethoscope,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const compressImage = (dataUrl: string, maxWidth = 1000, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

export const PrescriptionReaderPage: React.FC = () => {
  const { parsePrescriptionOcr, addMedicine, addReminder, setActiveSection, showToast } = useCabinet();

  const [prescriptionImage, setPrescriptionImage] = useState<string>('');
  const [parsing, setParsing] = useState<boolean>(false);
  const [resultData, setResultData] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [remindersAdded, setRemindersAdded] = useState<Record<number, boolean>>({});

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        const compressedBase64 = await compressImage(rawBase64);
        setPrescriptionImage(compressedBase64);
        await parseScript(compressedBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseScript = async (base64Img: string) => {
    setParsing(true);
    setResultData(null);
    setRemindersAdded({});

    const res = await parsePrescriptionOcr(base64Img);
    setParsing(false);

    if (res && res.medicines) {
      setResultData(res);
      // Select all by default
      const initialSel: Record<number, boolean> = {};
      res.medicines.forEach((_: any, idx: number) => {
        initialSel[idx] = true;
      });
      setSelectedItems(initialSel);
      showToast('Prescription analyzed successfully!', 'success');
    } else {
      showToast('Completed scan with default suggestions', 'info');
    }
  };

  const handleSingleSetReminder = async (item: any, idx: number) => {
    const defaultTime = item.timing ? item.timing.split(',')[0].trim() : '08:00 AM';
    await addReminder({
      medicineName: item.medicineName,
      time: defaultTime,
      dosage: item.dosage,
      purpose: item.purpose || 'Prescribed by Doctor',
      repeat: 'Daily',
      completed: false
    });
    setRemindersAdded((prev) => ({ ...prev, [idx]: true }));
    showToast(`Reminder set for ${item.medicineName} at ${defaultTime}!`, 'success');
  };

  const handleSetAllReminders = async () => {
    if (!resultData || !resultData.medicines) return;
    let count = 0;
    for (let i = 0; i < resultData.medicines.length; i++) {
      if (selectedItems[i] && !remindersAdded[i]) {
        const item = resultData.medicines[i];
        const defaultTime = item.timing ? item.timing.split(',')[0].trim() : '08:00 AM';
        await addReminder({
          medicineName: item.medicineName,
          time: defaultTime,
          dosage: item.dosage,
          purpose: item.purpose || 'Prescribed by Doctor',
          repeat: 'Daily',
          completed: false
        });
        setRemindersAdded((prev) => ({ ...prev, [i]: true }));
        count++;
      }
    }
    if (count > 0) {
      showToast(`Set ${count} medicine reminders successfully!`, 'success');
    } else {
      showToast('All selected reminders are already active!', 'info');
    }
  };

  const handleBatchSave = async () => {
    if (!resultData || !resultData.medicines) return;

    let count = 0;
    for (let i = 0; i < resultData.medicines.length; i++) {
      if (selectedItems[i]) {
        const item = resultData.medicines[i];
        await addMedicine({
          name: item.medicineName,
          salt: item.salt || '',
          dosage: item.dosage,
          purpose: `${item.purpose || 'Prescribed'} (${item.frequency}, ${item.duration})`,
          quantity: item.quantityToBuy || 10,
          expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
          lowStockThreshold: 3,
          favorite: false
        });
        count++;
      }
    }

    showToast(`Added ${count} prescribed medicines to cabinet!`, 'success');
    setActiveSection('Medicine Cabinet');
  };

  const severity = resultData?.conditionSeverity || 'NORMAL';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in pb-12">
      <BackButtonHeader title="Prescription Reader" subtitle="Digitize & extract doctor prescriptions" />
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          Doctor Prescription Reader & Analysis
        </h1>
        <p className="text-xs text-slate-500">
          Upload a clear photo of your doctor's prescription to extract prescribed medicines, required testing, and health criticality.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 text-center space-y-4">
        {prescriptionImage ? (
          <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 group">
            <img src={prescriptionImage} alt="Doctor prescription" className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <label className="px-3.5 py-2 bg-white text-slate-800 rounded-xl text-xs font-semibold cursor-pointer">
                Upload Different Prescription
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className="border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50 rounded-3xl p-8 cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Upload Prescription Document / Image</p>
              <p className="text-xs text-slate-500 mt-0.5">Scans written doctor notes, clinic slips, or prescription photos</p>
            </div>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        )}

        {parsing && (
          <div className="py-4 flex flex-col items-center gap-2 text-xs font-semibold text-teal-700">
            <span className="w-6 h-6 border-3 border-teal-600/30 border-t-teal-600 rounded-full animate-spin" />
            <span>Reading handwriting & evaluating prescription...</span>
          </div>
        )}
      </div>

      {/* Parsed Analysis Sections */}
      {resultData && (
        <div className="space-y-6 animate-in fade-in">
          {/* 1. HEALTH CONDITION CRITICALITY EVALUATION */}
          <div
            className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
              severity === 'CRITICAL'
                ? 'bg-rose-50/90 border-rose-200/90 text-rose-950'
                : severity === 'SAFE'
                ? 'bg-emerald-50/90 border-emerald-200/90 text-emerald-950'
                : 'bg-amber-50/90 border-amber-200/90 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                {severity === 'CRITICAL' ? (
                  <div className="w-9 h-9 rounded-2xl bg-rose-200 text-rose-800 flex items-center justify-center font-bold shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : severity === 'SAFE' ? (
                  <div className="w-9 h-9 rounded-2xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest block opacity-75">
                    Prescription Clinical Assessment
                  </span>
                  <h3 className="text-base font-black flex items-center gap-2">
                    Condition Severity:
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase shadow-2xs ${
                        severity === 'CRITICAL'
                          ? 'bg-rose-600 text-white'
                          : severity === 'SAFE'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {severity}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs font-medium leading-relaxed opacity-90 pl-0.5">
              {resultData.severityReason || resultData.patientAdvice}
            </p>

            {resultData.patientAdvice && (
              <div className="pt-2 border-t border-black/5 text-[11px] font-semibold flex items-center gap-1.5 opacity-80">
                <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                <span>Doctor Advice: {resultData.patientAdvice}</span>
              </div>
            )}
          </div>

          {/* 2. REQUIRED TESTING & DIAGNOSTIC LAB TESTS */}
          {resultData.requiredTests && resultData.requiredTests.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Required Diagnostic & Lab Tests</h3>
                    <p className="text-xs text-slate-500">Recommended investigations identified on prescription</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                  {resultData.requiredTests.length} Tests
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resultData.requiredTests.map((test: any, tIdx: number) => (
                  <div
                    key={tIdx}
                    className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        {test.testName}
                      </h4>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                        {test.urgency || 'Recommended'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-snug">
                      {test.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PRESCRIBED MEDICINES LIST WITH SET REMINDERS */}
          {resultData.medicines && resultData.medicines.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    Prescribed Medicines
                  </h3>
                  <p className="text-xs text-slate-500">Medications extracted with suggested dosages & timings</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSetAllReminders}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Set Reminders For All</span>
                  </button>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {resultData.medicines.length} Items
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {resultData.medicines.map((med: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      selectedItems[idx]
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-slate-50 border-slate-200/80 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={!!selectedItems[idx]}
                          onChange={(e) =>
                            setSelectedItems((prev) => ({ ...prev, [idx]: e.target.checked }))
                          }
                          className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            {med.medicineName}
                            {med.salt && (
                              <span className="text-[11px] font-normal text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {med.salt}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-700 font-medium mt-0.5">
                            Dosage: <span className="font-bold text-slate-900">{med.dosage}</span> • {med.frequency} ({med.duration})
                          </p>
                          {med.purpose && (
                            <p className="text-[11px] text-slate-500 mt-0.5">Purpose: {med.purpose}</p>
                          )}
                        </div>
                      </div>

                      {/* Timing & Reminder Action */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {med.timing && (
                          <span className="text-[11px] font-bold text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-700" />
                            {med.timing}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSingleSetReminder(med, idx)}
                          disabled={!!remindersAdded[idx]}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                            remindersAdded[idx]
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                          }`}
                        >
                          {remindersAdded[idx] ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Reminder Active</span>
                            </>
                          ) : (
                            <>
                              <BellRing className="w-3.5 h-3.5" />
                              <span>Set Reminder</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  Select medications to import directly to your cabinet
                </span>

                <button
                  onClick={handleBatchSave}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Import Selected to Cabinet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

