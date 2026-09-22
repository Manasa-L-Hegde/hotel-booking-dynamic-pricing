import { Filter, Search, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicNav, Footer } from '../../components/AppShell';
import { HotelCard, SectionTitle } from '../../components/Ui';
import { hotelApi } from '../../services/api';
import { mockHotels } from '../../data/mockData';

const REGION_CHIPS = ['All', 'Goa', 'Mumbai', 'Bengaluru', 'Delhi', 'Jaipur', 'Kerala', 'Manali'];

export default function HotelSearch() {
  const [params, setParams] = useSearchParams();
  const [hotels, setHotels] = useState(mockHotels);
  const [loading, setLoading] = useState(false);

  const initialCity = params.get('city') || '';
  const [filters, setFilters] = useState({
    city: initialCity,
    rating: '',
    type: '',
    amenity: ''
  });

  useEffect(() => {
    setLoading(true);
    hotelApi
      .getHotels({ city: filters.city || undefined })
      .then((data) => {
        if (data && data.length > 0) {
          setHotels(data);
        } else {
          setHotels(mockHotels);
        }
      })
      .catch(() => {
        setHotels(mockHotels);
      })
      .finally(() => setLoading(false));
  }, [filters.city]);

  const shown = useMemo(() => {
    return hotels.filter((hotel) => {
      const cityMatches =
        !filters.city ||
        filters.city.toLowerCase() === 'all' ||
        (hotel.location?.city || hotel.city || '')
          .toLowerCase()
          .includes(filters.city.toLowerCase());

      const ratingMatches = !filters.rating || hotel.rating >= Number(filters.rating);

      const typeMatches =
        !filters.type ||
        hotel.rooms?.some((room) => room.type?.toLowerCase() === filters.type.toLowerCase());

      const amenityMatches =
        !filters.amenity ||
        hotel.amenities?.some((a) => a.toLowerCase().includes(filters.amenity.toLowerCase()));

      return cityMatches && ratingMatches && typeMatches && amenityMatches;
    });
  }, [hotels, filters]);

  const apply = (e) => {
    e.preventDefault();
    setParams({ ...Object.fromEntries(params), city: filters.city });
  };

  const handleRegionClick = (region) => {
    const val = region === 'All' ? '' : region;
    setFilters((prev) => ({ ...prev, city: val }));
    setParams({ ...Object.fromEntries(params), city: val });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <PublicNav />

      <main className="py-12 flex-1">
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle
            eyebrow="Explore Verified Inventory"
            title={filters.city ? `Luxury Stays in ${filters.city}` : 'Explore All 70+ Premier Stays'}
            description="Real-time room availability, verified guest reviews, and transparent machine learning rates."
          />

          {/* Region Quick Select Chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {REGION_CHIPS.map((chip) => {
              const active =
                (!filters.city && chip === 'All') ||
                filters.city.toLowerCase() === chip.toLowerCase();
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleRegionClick(chip)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {chip === 'All' ? 'All Stays (70+)' : chip}
                </button>
              );
            })}
          </div>

          {/* Filters Bar */}
          <form
            onSubmit={apply}
            className="mb-8 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md md:grid-cols-5"
          >
            <label className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                placeholder="City or destination"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </label>

            <select
              aria-label="Minimum rating"
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="">Any Guest Rating</option>
              <option value="4.5">4.5+ Rating</option>
              <option value="4.7">4.7+ Elite Rating</option>
              <option value="4.8">4.8+ Exceptional</option>
            </select>

            <select
              aria-label="Room type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="">All Room Categories</option>
              <option value="Single">Single Room</option>
              <option value="Double">Double Room</option>
              <option value="Deluxe">Deluxe Room</option>
              <option value="Suite">Presidential Suite</option>
            </select>

            <select
              aria-label="Amenity"
              value={filters.amenity}
              onChange={(e) => setFilters({ ...filters, amenity: e.target.value })}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="">Key Amenities</option>
              <option value="Pool">Swimming Pool</option>
              <option value="Spa">Spa & Wellness</option>
              <option value="Beach">Beachfront / Sea View</option>
              <option value="Wi-Fi">High-Speed Wi-Fi</option>
              <option value="Breakfast">Breakfast Included</option>
            </select>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <Filter size={16} />
              Filter Stays
            </button>
          </form>

          {/* Results Header */}
          <div className="mb-6 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{shown.length}</strong> available stays
            </span>
            <span>Live ML Dynamic Rates Enabled</span>
          </div>

          {/* Stays Grid */}
          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-16 text-center text-slate-400">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
              Loading luxury stays across India…
            </div>
          ) : shown.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((hotel) => (
                <HotelCard
                  key={hotel._id || hotel.id}
                  hotel={hotel}
                  search={params.toString()}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-16 text-center text-slate-400">
              <p className="text-base font-semibold text-slate-200">
                No stays match your active filters.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Try selecting "All" or clearing specific amenity filters to view all 70+ properties.
              </p>
              <button
                onClick={() => setFilters({ city: '', rating: '', type: '', amenity: '' })}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
