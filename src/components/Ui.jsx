import { ArrowUpRight, Star, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.2em] text-indigo-400">
            <Sparkles size={13} className="text-amber-400" />
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function HotelCard({ hotel, search }) {
  const hotelId = hotel._id || hotel.id;
  const room = hotel.rooms?.find((item) => item.isAvailable !== false) || hotel.rooms?.[0];
  const basePrice = room?.basePrice || 3200;
  const dynamicPrice = Math.round(basePrice * 1.15);
  const city = hotel.location?.city || hotel.city || 'India';
  const address = hotel.location?.address || hotel.address || '';

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between">
      {/* Image with Region Badge */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-slate-700/50">
          <MapPin size={12} className="text-indigo-400" />
          {city}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-slate-950 backdrop-blur-md shadow-md">
          <Star size={12} fill="currentColor" />
          {hotel.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition line-clamp-1">
            {hotel.name}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">{address}</p>

          {/* Amenities tags */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {hotel.amenities?.slice(0, 3).map((item) => (
              <span
                key={item}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-0.5 text-[11px] font-medium text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="mt-5 flex items-end justify-between border-t border-slate-800/80 pt-4">
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Starting from
            </span>
            <p className="text-xl font-black text-white mt-0.5">
              {money(basePrice)}
              <span className="text-xs font-normal text-slate-400"> / night</span>
            </p>
          </div>

          <Link
            to={`/hotels/${hotelId}${search ? `?${search}` : ''}`}
            className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
          >
            Explore <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function StatusPill({ children }) {
  const style = {
    Confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    Refunded: 'bg-slate-800 text-slate-300 border border-slate-700',
    Active: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    Available: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Occupied: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Maintenance: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    High: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
        style[children] || 'bg-slate-800 text-slate-300 border border-slate-700'
      }`}
    >
      {children}
    </span>
  );
}

export function Table({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="border-b border-slate-800 bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-3.5">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80 text-slate-300">{rows}</tbody>
      </table>
    </div>
  );
}
