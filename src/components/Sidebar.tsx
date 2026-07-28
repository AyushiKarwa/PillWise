import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import {
  LayoutDashboard,
  Pill,
  PlusCircle,
  Bot,
  Scan,
  FileText,
  Tag,
  ShieldAlert,
  BellRing,
  History,
  AlertOctagon,
  MapPin,
  Heart,
  Menu,
  X
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar
}) => {
  const { activeSection, setActiveSection, medicines, reminders } = useCabinet();

  const lowStockCount = medicines.filter((m) => m.quantity <= m.lowStockThreshold).length;
  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Medicine Cabinet', icon: Pill, badge: medicines.length },
    { name: 'Add Medicine', icon: PlusCircle },
    { name: 'AI Assistant', icon: Bot, highlight: true },
    { name: 'Scan Medicine', icon: Scan },
    { name: 'Prescription Reader', icon: FileText },
    { name: 'Price Comparison', icon: Tag },
    { name: 'Drug Interaction Checker', icon: ShieldAlert },
    { name: 'Reminders', icon: BellRing, badge: pendingRemindersCount > 0 ? pendingRemindersCount : undefined, badgeColor: 'bg-emerald-500 text-white' },
    { name: 'History', icon: History },
    { name: 'Nearby Pharmacies', icon: MapPin },
    { name: 'Emergency', icon: AlertOctagon, isEmergency: true }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-50/90 backdrop-blur-xl border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-200/60">
          <div
            onClick={() => {
              setActiveSection('Dashboard');
              if (isOpen) toggleSidebar();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
                PillWise
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h1>
              <p className="text-[11px] font-medium text-emerald-600">Smart Medicine Cabinet</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.name;

            let btnStyle = 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900';
            if (isActive) {
              if (item.isEmergency) {
                btnStyle = 'bg-rose-50 text-rose-700 font-semibold border border-rose-200/80 shadow-xs';
              } else {
                btnStyle = 'bg-emerald-100/90 text-emerald-800 font-bold shadow-2xs';
              }
            } else if (item.isEmergency) {
              btnStyle = 'text-rose-600 hover:bg-rose-50 hover:text-rose-700';
            }

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveSection(item.name);
                  if (isOpen) toggleSidebar();
                }}
                className={`w-[100%] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive && !item.isEmergency
                        ? 'text-emerald-700'
                        : isActive && item.isEmergency
                        ? 'text-rose-600'
                        : item.isEmergency
                        ? 'text-rose-500'
                        : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate font-medium">{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || (isActive ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200/80 text-slate-700')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Premium Upgrade Card (Matching Template) */}
        <div className="p-3 m-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
            <span className="text-sm">👑</span>
            <span className="text-slate-800">Premium Features</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Unlock advanced AI insights, detailed analytics & more.
          </p>
          <button
            onClick={() => {
              setActiveSection('AI Assistant');
              if (isOpen) toggleSidebar();
            }}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors text-center shadow-2xs"
          >
            Upgrade Now
          </button>
        </div>
      </aside>
    </>
  );
};
