import React from 'react';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { AlertOctagon, Phone, Hospital, ShieldAlert, HeartPulse, Navigation } from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const helplines = [
    { name: 'National Ambulance', number: '102 / 911', desc: 'Immediate medical transport & ER' },
    { name: 'Poison Control Center', number: '1-800-222-1222', desc: 'Overdose, accidental toxin ingestion' },
    { name: 'National Emergency Response', number: '112', desc: 'All-in-one emergency dispatch' },
    { name: 'Medical Helpline', number: '104', desc: 'General healthcare emergency guidance' }
  ];

  const emergencyHospitals = [
    { name: 'City Care General Hospital & ER', distance: '1.2 km', phone: '+1 (800) 555-9911', open: '24x7 Emergency Room' },
    { name: 'St. Jude Trauma Center', distance: '2.8 km', phone: '+1 (800) 555-9922', open: '24x7 Critical Care' }
  ];

  const firstAidTips = [
    {
      title: 'Severe Allergic Reaction (Anaphylaxis)',
      steps: ['Locate and administer EpiPen if available', 'Call emergency ambulance immediately', 'Keep person lying flat with feet elevated']
    },
    {
      title: 'Accidental Medicine Overdose',
      steps: ['Call Poison Control instantly', 'Do NOT induce vomiting unless instructed', 'Keep medicine packaging ready for reference']
    },
    {
      title: 'Choking First Aid',
      steps: ['Perform abdominal thrusts (Heimlich maneuver)', 'Give 5 back blows between shoulder blades', 'Call ER if airway remains obstructed']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
      <BackButtonHeader title="Emergency Contacts" subtitle="Urgent Care & ER" />
      {/* Emergency Header Banner */}
      <div className="bg-rose-900 text-white p-6 sm:p-8 rounded-3xl border border-rose-700 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md">
            <AlertOctagon className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Emergency Medical Support</h1>
            <p className="text-xs text-rose-200">If you are experiencing a life-threatening medical emergency, call 911/102 immediately.</p>
          </div>
        </div>
      </div>

      {/* Emergency Helplines Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Phone className="w-4 h-4 text-rose-600" />
          Immediate Emergency Helplines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {helplines.map((h, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-rose-200/80 p-4 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{h.name}</h3>
                <p className="text-[11px] text-slate-500">{h.desc}</p>
                <p className="text-base font-extrabold text-rose-600 mt-1">{h.number}</p>
              </div>
              <a
                href={`tel:${h.number.split('/')[0].trim()}`}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Call
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Hospitals */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Hospital className="w-4 h-4 text-slate-800" />
          24x7 Emergency Trauma Hospitals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyHospitals.map((hos, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{hos.name}</h3>
                  <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">{hos.open}</p>
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{hos.distance}</span>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${hos.phone}`}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg text-center"
                >
                  Call ER
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(hos.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* First Aid Guides */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-rose-600" />
          Essential First-Aid Quick Reference
        </h2>

        <div className="space-y-3">
          {firstAidTips.map((tip, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs space-y-1.5">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{tip.title}</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {tip.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
