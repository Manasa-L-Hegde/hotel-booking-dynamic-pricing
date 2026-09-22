import {
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
  Zap,
  Award,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockHotels } from '../../data/mockData';
import { HotelCard, SectionTitle } from '../../components/Ui';
import { PublicNav, Footer } from '../../components/AppShell';
import { hotelApi } from '../../services/api';

const REGIONS = [
  { id: 'all', label: 'All Stays (70+)' },
  { id: 'Goa', label: '🏖️ Goa (10)' },
  { id: 'Mumbai', label: '🌆 Mumbai (10)' },
  { id: 'Bengaluru', label: '💻 Bengaluru (10)' },
  { id: 'Delhi', label: '🏛️ Delhi NCR (10)' },
  { id: 'Jaipur', label: '👑 Rajasthan (10)' },
  { id: 'Kerala', label: '🌴 Kerala (10)' },
  { id: 'Manali', label: '🏔️ Manali (10)' }
];

export default function Home() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState(mockHotels);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [form, setForm] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: '2'
  });

  useEffect(() => {
    hotelApi
      .getHotels()
      .then((data) => {
        if (data && data.length > 0) setHotels(data);
      })
      .catch(() => {
        setHotels(mockHotels);
      });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    navigate(`/hotels?${new URLSearchParams(form)}`);
  };

  const filteredHotels =
    selectedRegion === 'all'
      ? hotels
      : hotels.filter(
          (h) => (h.location?.city || h.city).toLowerCase() === selectedRegion.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <PublicNav />

      <main>
        {/* HERO SECTION */}
        <section className="relative isolate overflow-hidden py-20 sm:py-32">
          {/* Background image with high-contrast gradient overlay */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.85),rgba(2,6,23,0.95)),url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85')] bg-cover bg-center" />

          <div className="mx-auto max-w-7xl px-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" />
              70+ CURATED LUXURY STAYS ACROSS INDIA
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Book Smarter. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                Pay the Right Price.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Experience handpicked beachfront villas, royal palaces, and snow-view alpine retreats with real-time AI dynamic rate intelligence.
            </p>

            {/* Quick Search Bar */}
            <form
              onSubmit={submit}
              className="mt-10 grid gap-3 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl md:grid-cols-[1.25fr_1fr_1fr_.8fr_auto]"
            >
              <Field
                icon={<MapPin size={18} />}
                label="Destination"
                value={form.city}
                placeholder="Goa, Mumbai, Manali..."
                change={(city) => setForm({ ...form, city })}
              />
              <Field
                icon={<CalendarDays size={18} />}
                label="Check In"
                type="date"
                value={form.checkIn}
                change={(checkIn) => setForm({ ...form, checkIn })}
              />
              <Field
                icon={<CalendarDays size={18} />}
                label="Check Out"
                type="date"
                value={form.checkOut}
                change={(checkOut) => setForm({ ...form, checkOut })}
              />
              <Field
                icon={<Users size={18} />}
                label="Guests"
                value={form.guests}
                type="select"
                change={(guests) => setForm({ ...form, guests })}
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
              >
                <Search size={18} />
                Search Stays
              </button>
            </form>

            {/* Value Highlights */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-400" />
                <span>Real-Time ML Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-purple-400" />
                <span>Top-Rated Hospitality</span>
              </div>
            </div>
          </div>
        </section>

        {/* REGION FILTER TABS & HOTEL CATALOG */}
        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <SectionTitle
              eyebrow="Curated Properties"
              title="Handpicked Stays across India"
              description="Explore 10+ distinct properties per destination with guaranteed verified ratings."
            />

            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300"
            >
              View Full Catalog (70+) <ArrowRight size={16} />
            </Link>
          </div>

          {/* Region Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`shrink-0 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                  selectedRegion === r.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Hotel Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.slice(0, 9).map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>

          {filteredHotels.length > 9 && (
            <div className="mt-12 text-center">
              <Link
                to={selectedRegion === 'all' ? '/hotels' : `/hotels?city=${selectedRegion}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-slate-850 hover:border-indigo-500"
              >
                Show More {selectedRegion !== 'all' ? selectedRegion : ''} Stays ({filteredHotels.length} total){' '}
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* DYNAMIC PRICING SHOWCASE BANNER */}
        <section className="border-t border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
                Machine Learning Rate Engine
              </span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                Rates that reflect true real-time demand.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300">
                Unlike opaque hotel booking sites, SmartStay reveals exactly how your price was determined based on destination occupancy, season, day of the week, and lead days.
              </p>
              <div className="pt-2">
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-500"
                >
                  Launch Dynamic Pricing Playground <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              {[
                ['Destination Demand', 'High (+25%)', 'Live surge factor applied to rooms'],
                ['Hotel Occupancy', '85% Full', 'Remaining rooms adjust automatically'],
                ['Advance Lead Time', '7 Days', 'Early bird savings up to 15%'],
                ['Certified ML Rate', 'Fair Price', 'Zero arbitrary algorithmic markups']
              ].map(([title, val, desc]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-md"
                >
                  <p className="text-xs text-slate-400">{title}</p>
                  <p className="mt-1 text-lg font-bold text-white">{val}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({ icon, label, value, change, type = 'text', placeholder }) {
  return (
    <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 transition hover:border-slate-700">
      <span className="text-indigo-400">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => change(e.target.value)}
            className="mt-0.5 w-full bg-transparent text-sm font-semibold text-white outline-none"
          >
            <option value="1" className="bg-slate-900">1 Guest</option>
            <option value="2" className="bg-slate-900">2 Guests</option>
            <option value="3" className="bg-slate-900">3 Guests</option>
            <option value="4" className="bg-slate-900">4 Guests</option>
          </select>
        ) : (
          <input
            required={label === 'Destination'}
            type={type}
            value={value}
            onChange={(e) => change(e.target.value)}
            placeholder={placeholder}
            className="mt-0.5 w-full bg-transparent text-sm font-semibold text-white outline-none placeholder-slate-500"
          />
        )}
      </span>
    </label>
  );
}
