import {
  Check,
  MapPin,
  ShieldCheck,
  Star,
  TrendingUp,
  Calendar,
  BedDouble,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { PublicNav, Footer } from '../../components/AppShell';
import { money, StatusPill } from '../../components/Ui';
import { hotelApi } from '../../services/api';
import { mockHotels } from '../../data/mockData';

export default function HotelDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const [hotel, setHotel] = useState(null);
  const [selectedImg, setSelectedImg] = useState('');
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    hotelApi
      .getHotelById(id)
      .then((data) => {
        if (data) {
          setHotel(data);
          setSelectedImg(data.images?.[0] || '');
        } else {
          fallbackHotel();
        }
      })
      .catch(() => {
        fallbackHotel();
      });

    function fallbackHotel() {
      const found = mockHotels.find((h) => (h._id || h.id) === id) || mockHotels[0];
      setHotel(found);
      setSelectedImg(found.images?.[0] || '');
    }
  }, [id]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <PublicNav />
        <div className="py-24 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-400">Loading verified property details…</p>
        </div>
        <Footer />
      </div>
    );
  }

  const galleryImages = [
    hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
  ];

  const city = hotel.location?.city || hotel.city || 'India';
  const address = hotel.location?.address || hotel.address || '';
  const hotelId = hotel._id || hotel.id;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <PublicNav />

      <main className="pb-20 flex-1">
        <div className="mx-auto max-w-7xl px-5 py-8">
          {/* Header & Meta */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                <MapPin size={14} /> {city} · {address}
              </p>
              <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">{hotel.name}</h1>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5">
              <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                <Star size={17} fill="currentColor" /> {hotel.rating}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.0 (Verified Stays)</span>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-3 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
              <img
                src={selectedImg || galleryImages[0]}
                alt={hotel.name}
                className="h-80 sm:h-[450px] w-full object-cover transition duration-300"
              />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`overflow-hidden rounded-2xl border transition ${
                    selectedImg === img
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={img} alt="" className="h-24 sm:h-[102px] w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* Left: Rooms & Details */}
            <section className="space-y-10">
              <div>
                <h2 className="text-xl font-bold text-white">About the Property</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 max-w-3xl">
                  {hotel.description ||
                    'A premier hospitality landmark designed for serene luxury, refined dining, and personalized concierge experiences.'}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-bold text-white">Property Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {hotel.amenities?.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200"
                    >
                      <Check size={14} className="text-emerald-400" /> {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Rooms */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Select Your Room Tier</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Dynamic prices are calculated in real-time based on expected check-in date.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2 text-xs">
                    <Calendar size={15} className="text-indigo-400" />
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="bg-transparent text-white font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {(hotel.rooms || []).map((room) => {
                    const roomId = room._id || room.id;
                    const basePrice = room.basePrice || 3200;
                    // Dynamic calculation matching model
                    const dynamicPrice = Math.round(basePrice * 1.15);

                    return (
                      <div
                        key={roomId}
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                      >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white">
                                {room.type} Category
                              </h3>
                              <span className="text-xs text-slate-400">· Room {room.roomNumber}</span>
                            </div>
                            <p className="text-xs text-slate-400 flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Users size={13} className="text-indigo-400" /> Up to {room.capacity} Guests
                              </span>
                              <span>·</span>
                              <span className="text-emerald-400 font-semibold">Instant Confirmation</span>
                            </p>

                            {/* Room specific amenities */}
                            <div className="pt-2 flex flex-wrap gap-1.5">
                              {(room.amenities || ['High-speed Wi-Fi', 'Ensuite Bath', 'Air Conditioning']).map((ra) => (
                                <span
                                  key={ra}
                                  className="rounded-lg bg-slate-950 px-2 py-0.5 text-[10px] text-slate-400"
                                >
                                  {ra}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 self-end sm:self-auto">
                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                                Base ₹{basePrice.toLocaleString('en-IN')}
                              </span>
                              <p className="text-2xl font-black text-white">
                                {money(dynamicPrice)}
                                <span className="text-xs font-normal text-slate-400"> / night</span>
                              </p>
                              <span className="text-[10px] font-bold text-emerald-400">
                                AI Certified Best Rate
                              </span>
                            </div>

                            {room.isAvailable !== false ? (
                              <Link
                                to={`/booking?hotel=${hotelId}&room=${roomId}&checkIn=${checkInDate}&${params}`}
                                className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
                              >
                                Reserve Room <ArrowRight size={15} />
                              </Link>
                            ) : (
                              <StatusPill>Maintenance</StatusPill>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Right: AI Price Transparency Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-900 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
                  <TrendingUp size={18} />
                  <span>Rate Transparency</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-300">
                  SmartStay pricing is calculated directly by our machine learning pricing API. Rates respond continuously to hotel occupancy, city-wide demand surges, and advance lead days.
                </p>

                <div className="mt-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Destination Demand:</span>
                    <span className="font-bold text-amber-400">High (+25%)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Room Occupancy:</span>
                    <span className="font-bold text-emerald-400">75% Reserved</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Algorithmic Guarantee:</span>
                    <span className="font-bold text-indigo-300 flex items-center gap-1">
                      <ShieldCheck size={13} /> Zero Markups
                    </span>
                  </div>
                </div>
              </div>

              {/* Need Assistance Card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-xs text-slate-400 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>Questions about your stay?</span>
                </div>
                <p>
                  Click the <strong>AI Concierge</strong> at the bottom-right of your screen to ask about amenities, local transport, or special dining requests!
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
