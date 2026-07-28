import React, { useState, useEffect } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { MedicineAutocomplete } from '../components/MedicineAutocomplete';
import { Tag, Search, ExternalLink, ShoppingCart, Truck, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { PriceOffer } from '../types';

const QUICK_SEARCH_MEDICINES = [
  'Saridon',
  'Boroline',
  'Volini Gel',
  'Dolo 650',
  'Crocin 650',
  'Combiflam',
  'Pantocid 40mg',
  'Cetirizine 10mg'
];

export const PriceComparisonPage: React.FC = () => {
  const { priceCheckMedicine, setPriceCheckMedicine, showToast } = useCabinet();
  const [searchTerm, setSearchTerm] = useState<string>(priceCheckMedicine || 'Dolo 650');
  const [loading, setLoading] = useState<boolean>(false);
  const [offers, setOffers] = useState<PriceOffer[]>([]);

  const fetchPrices = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pharmacy/prices?name=${encodeURIComponent(name)}`).then((r) => r.json());
      if (res.success) {
        setOffers(res.prices);
      }
    } catch (err) {
      showToast('Error loading price comparison', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (priceCheckMedicine) {
      setSearchTerm(priceCheckMedicine);
      fetchPrices(priceCheckMedicine);
    } else {
      fetchPrices(searchTerm);
    }
  }, [priceCheckMedicine]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrices(searchTerm);
  };

  const handleQuickSelect = (medName: string) => {
    setSearchTerm(medName);
    fetchPrices(medName);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
      <BackButtonHeader title="Price Comparison" subtitle="Online Pharmacy Deals" />

      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-teal-600" />
          Accurate Live Online Price Comparison
        </h1>
        <p className="text-xs text-slate-500">
          Compare real market prices (MRP vs discounted rates) across Tata 1mg, Apollo Pharmacy, PharmEasy, and Netmeds.
        </p>
      </div>

      {/* Search Input with Autocomplete */}
      <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <MedicineAutocomplete
              value={searchTerm}
              onChange={(val) => setSearchTerm(val)}
              onSelect={(med) => handleQuickSelect(med.name)}
              placeholder="Search medicine price (e.g. Dolo 650, Cetirizine, Vitamin C)..."
              className="w-full px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none border-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shrink-0 cursor-pointer"
          >
            Compare Rates
          </button>
        </div>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 flex-wrap text-xs">
          <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" /> Popular:
          </span>
          {QUICK_SEARCH_MEDICINES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleQuickSelect(m)}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border transition-all ${
                searchTerm.toLowerCase() === m.toLowerCase()
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </form>

      {/* Price Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500 font-semibold flex flex-col items-center gap-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs">
          <span className="w-6 h-6 border-3 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
          <span>Fetching accurate market pricing for "{searchTerm}"...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{offer.pharmacyName}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-semibold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{offer.deliveryTime}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                  {offer.discount}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Real Store Price</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">₹{offer.price}</span>
                    {offer.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">MRP ₹{offer.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" />
                    In Stock
                  </span>
                </div>
              </div>

              <a
                href={offer.buyUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>View & Buy on {offer.pharmacyName}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
