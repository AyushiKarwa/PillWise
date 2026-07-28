import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { Scan, Camera, Upload, Sparkles, Check, ArrowRight, Pill, Edit3 } from 'lucide-react';

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

export const ScanMedicinePage: React.FC = () => {
  const { scanMedicineOcr, addMedicine, setActiveSection, showToast } = useCabinet();

  const [imagePreview, setImagePreview] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [detectedData, setDetectedData] = useState<any>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        const compressedBase64 = await compressImage(rawBase64);
        setImagePreview(compressedBase64);
        await performScan(compressedBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const performScan = async (base64Img: string) => {
    setScanning(true);
    setDetectedData(null);

    const result = await scanMedicineOcr(base64Img);
    setScanning(false);

    if (result) {
      setDetectedData({
        name: result.name || 'Detected Medicine',
        salt: result.salt || '',
        dosage: result.dosage || '1 tablet daily',
        expiryDate: result.expiryDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
        purpose: result.purpose || 'General medical use',
        quantity: 10,
        lowStockThreshold: 3,
        image: base64Img,
        favorite: false
      });
      showToast('OCR scan complete! Review detected fields below.', 'success');
    }
  };

  const handleSaveToCabinet = async () => {
    if (!detectedData) return;
    setSaving(true);
    const created = await addMedicine(detectedData);
    setSaving(false);
    if (created) {
      setActiveSection('Medicine Cabinet');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in pb-12">
      <BackButtonHeader title="Scan Medicine Box" subtitle="Smart Box Reader" />
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Scan className="w-5 h-5 text-teal-600" />
          OCR Medicine Box Scanner
        </h1>
        <p className="text-xs text-slate-500">
          Upload or capture a photo of your medicine package or box to detect details automatically.
        </p>
      </div>

      {/* Photo Upload Area */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 text-center space-y-4">
        {imagePreview ? (
          <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-200 group">
            <img src={imagePreview} alt="Scanned box" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <label className="px-3 py-1.5 bg-white text-slate-800 rounded-xl text-xs font-semibold cursor-pointer">
                Change Photo
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className="border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50 rounded-3xl p-8 cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-xs">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Upload or Capture Medicine Photo</p>
              <p className="text-xs text-slate-500 mt-0.5">Supports PNG, JPG, JPEG box packages</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}

        {scanning && (
          <div className="py-4 flex flex-col items-center gap-2 text-xs font-semibold text-teal-700">
            <span className="w-6 h-6 border-3 border-teal-600/30 border-t-teal-600 rounded-full animate-spin" />
            <span>Scanning medicine packaging...</span>
          </div>
        )}
      </div>

      {/* Detected Form Review */}
      {detectedData && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Detected Details (Editable)
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              ✔ Scanned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detected Name</label>
              <input
                type="text"
                value={detectedData.name}
                onChange={(e) => setDetectedData({ ...detectedData, name: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detected Salt</label>
              <input
                type="text"
                value={detectedData.salt}
                onChange={(e) => setDetectedData({ ...detectedData, salt: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detected Dosage</label>
              <input
                type="text"
                value={detectedData.dosage}
                onChange={(e) => setDetectedData({ ...detectedData, dosage: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detected Expiry Date</label>
              <input
                type="date"
                value={detectedData.expiryDate}
                onChange={(e) => setDetectedData({ ...detectedData, expiryDate: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Indications</label>
            <input
              type="text"
              value={detectedData.purpose}
              onChange={(e) => setDetectedData({ ...detectedData, purpose: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setImagePreview('');
                setDetectedData(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Reset Scan
            </button>

            <button
              type="button"
              onClick={handleSaveToCabinet}
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Confirm & Save to Cabinet'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
