import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { MedicineCard } from '../components/MedicineCard';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { Search, Plus, Filter, Star, Clock, AlertTriangle, Pill, ArrowUpDown, Scan } from 'lucide-react';

export const MedicineCabinetPage: React.FC = () => {
  const { medicines, setActiveSection } = useCabinet();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'expiring' | 'lowStock'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'expiry'>('expiry');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filtered = medicines.filter((m) => {
    // Search
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(term) ||
      (m.salt && m.salt.toLowerCase().includes(term)) ||
      (m.purpose && m.purpose.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (filterType === 'favorites') return m.favorite;
    if (filterType === 'lowStock') return m.quantity <= m.lowStockThreshold;
    if (filterType === 'expiring') {
      const isExpired = m.expiryDate <= todayStr;
      const isExpiringSoon =
        !isExpired &&
        new Date(m.expiryDate).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 60;
      return isExpired || isExpiringSoon;
    }

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'quantity') return a.quantity - b.quantity;
    if (sortBy === 'expiry') return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    return 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      <BackButtonHeader title="Medicine Cabinet" subtitle="Home Inventory" />

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" />
            Medicine Cabinet
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your home inventory, check expiration dates, and restock supplies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('Scan Medicine')}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Scan className="w-4 h-4 text-teal-600" />
            <span>Scan Box</span>
          </button>

          <button
            onClick={() => setActiveSection('Add Medicine')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, salt, or purpose..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-emerald-500"
            >
              <option value="expiry">Sort by Expiry Date</option>
              <option value="quantity">Sort by Lowest Quantity</option>
              <option value="name">Sort A-Z</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items ({medicines.length})
          </button>

          <button
            onClick={() => setFilterType('favorites')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition-colors ${
              filterType === 'favorites'
                ? 'bg-amber-500 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Favorites ({medicines.filter((m) => m.favorite).length})</span>
          </button>

          <button
            onClick={() => setFilterType('lowStock')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition-colors ${
              filterType === 'lowStock'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock ({medicines.filter((m) => m.quantity <= m.lowStockThreshold).length})</span>
          </button>

          <button
            onClick={() => setFilterType('expiring')}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition-colors ${
              filterType === 'expiring'
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Expiring / Expired</span>
          </button>
        </div>
      </div>

      {/* Grid of Medicine Cards */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Pill className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No medicines found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search query or filter selection.'
              : 'Your medicine cabinet is currently empty. Add your first medicine to get started!'}
          </p>
          <button
            onClick={() => setActiveSection('Add Medicine')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Add New Medicine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((med) => (
            <MedicineCard key={med._id} medicine={med} />
          ))}
        </div>
      )}
    </div>
  );
};
