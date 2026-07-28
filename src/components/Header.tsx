import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { Menu, Search, Bell, ChevronDown, Plus, AlertOctagon } from 'lucide-react';

export const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { activeSection, setActiveSection, medicines, reminders, setSymptomQuery, userName, setShowNamePrompt } = useCabinet();
  const [searchInput, setSearchInput] = useState('');

  const displayName = userName.trim() || 'User';
  const initials = userName.trim()
    ? userName.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSymptomQuery(searchInput);
    setActiveSection('Dashboard');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile active section indicator */}
        <h2 className="text-base font-bold text-slate-800 sm:hidden">
          {activeSection}
        </h2>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-auto hidden sm:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search medicines, symptoms, and more..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </form>

      {/* Right User & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications Bell */}
        <button
          onClick={() => setActiveSection('Reminders')}
          className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          title="Today's Reminders & Alerts"
        >
          <Bell className="w-5 h-5" />
          {pendingRemindersCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {pendingRemindersCount}
            </span>
          )}
        </button>

        {/* Quick Add Medicine */}
        <button
          onClick={() => setActiveSection('Add Medicine')}
          className="p-2 sm:px-3 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Add Medicine</span>
        </button>

        {/* User Profile Badge */}
        <button
          onClick={() => setShowNamePrompt(true)}
          className="flex items-center gap-2 pl-2 border-l border-slate-200/80 hover:opacity-80 transition-opacity text-left"
          title="Click to edit your name"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-2xs">
            {initials}
          </div>
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-700">
            <span className="max-w-[100px] truncate">{displayName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </button>
      </div>
    </header>
  );
};
