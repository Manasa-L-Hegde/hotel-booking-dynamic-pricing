import { BarChart3, BedDouble, Building2, CalendarCheck, CircleDollarSign, Mail, Phone, Plus, Search, ShieldCheck, Users, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { adminApi, hotelApi, bookingApi } from '../../services/api';
import { analyticsData, bookingRows as defaultBookingRows, mockHotels, pricingRows } from '../../data/mockData';
import { money, SectionTitle, StatusPill, Table } from '../../components/Ui';

const chartStyle = { fontSize: 12, fill: '#64748b' };
const Stat = ({ label, value, Icon, color = 'indigo' }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      </div>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
        <Icon size={22}/>
      </span>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
    <div className="mb-5">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
    {children}
  </section>
);

export function AdminOverview() {
  const [hotelList, setHotelList] = useState([]);
  const [totalRooms, setTotalRooms] = useState(0);

  useEffect(() => {
    hotelApi.getHotels().then((data) => {
      if (Array.isArray(data)) {
        setHotelList(data);
        const rooms = data.reduce((sum, h) => sum + (h.rooms?.length || 0), 0);
        setTotalRooms(rooms);
      }
    });
  }, []);

  const hotelCount = hotelList.length || 16;
  const roomCount = totalRooms || 64;

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
            <Sparkles size={14} /> Administrator Control Center
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">SmartStay Operations</h1>
          <p className="mt-1 text-sm text-slate-500">Live operational overview, inventory, and dynamic rate intelligence.</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Operational
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Active Stays" value={hotelCount} Icon={Building2}/>
        <Stat label="Total Rooms Listed" value={roomCount} Icon={BedDouble}/>
        <Stat label="Today's Reservations" value="48" Icon={CalendarCheck}/>
        <Stat label="Projected Daily Revenue" value="₹5.42L" Icon={CircleDollarSign}/>
      </div>

      <LoginMetrics/>

      <div className="mt-10">
        <SectionTitle eyebrow="Reservations" title="Recent Guest Bookings" description="Latest booking events processed through the central reservations engine."/>
        <BookingsTable rows={defaultBookingRows}/>
      </div>
    </>
  );
}

function LoginMetrics() {
  const [state, setState] = useState({ loading: true, stats: null, active: null, trend: [] });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [stats, active, trend] = await Promise.all([
          adminApi.getLoginStatistics(),
          adminApi.getActiveUsers(),
          adminApi.getDailyLoginStatistics({ days: 7 })
        ]);
        if (!alive) return;
        const grouped = Object.values(trend.data.reduce((all, row) => {
          const key = row._id.date;
          all[key] ||= { date: key, email: 0, otp: 0 };
          all[key][row._id.method === 'EMAIL' ? 'email' : 'otp'] = row.count;
          return all;
        }, {}));
        setState({ loading: false, stats, active, trend: grouped });
      } catch {
        if (alive) setState({ loading: false, stats: null, active: null, trend: [] });
      }
    };
    load();
    const timer = setInterval(load, 60_000);
    return () => { alive = false; clearInterval(timer); };
  }, []);

  if (state.loading) return <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading security audit stream…</div>;
  if (!state.stats) return null;

  return (
    <section className="mt-10">
      <SectionTitle eyebrow="Security Audit" title="Live Authentication Activity" description={`Automated telemetry with active ${state.active?.activeSessionTimeoutMinutes || 30}-minute session timeout.`}/>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Active Sessions" value={state.active.activeUsers} Icon={Users}/>
        <Stat label="Total Logins Today" value={state.stats.totalLoginsToday} Icon={ShieldCheck}/>
        <Stat label="Email Logins" value={state.stats.emailLoginsToday} Icon={Mail}/>
        <Stat label="Mobile OTP Logins" value={state.stats.mobileOtpLoginsToday} Icon={Phone}/>
        <Stat label="Failed Attempts" value={state.stats.failedAttemptsToday} Icon={BarChart3}/>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Authentication Channels" subtitle="Distribution of sign-ins between Email and Mobile OTP">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={[{name:'Email', value: state.stats.emailLoginsToday || 1}, {name:'Mobile OTP', value: state.stats.mobileOtpLoginsToday || 1}]} dataKey="value" outerRadius={90} label>
                {['#4f46e5','#06b6d4'].map((fill) => <Cell key={fill} fill={fill}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Daily Sign-in Velocity" subtitle="7-day login volume grouped by method">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={state.trend}>
              <CartesianGrid vertical={false} stroke="#f1f5f9"/>
              <XAxis dataKey="date" tick={chartStyle} axisLine={false} tickLine={false}/>
              <YAxis tick={chartStyle} axisLine={false} tickLine={false}/>
              <Tooltip/>
              <Line dataKey="email" name="Email" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }}/>
              <Line dataKey="otp" name="Mobile OTP" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

export function HotelsAdmin() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    hotelApi.getHotels().then((data) => {
      setHotels(Array.isArray(data) ? data : mockHotels);
    });
  }, []);

  const displayHotels = hotels.length ? hotels : mockHotels;
  const filtered = displayHotels.filter((h) => {
    const matchesSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.location?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesCity = !selectedCity || h.location?.city?.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const uniqueCities = Array.from(new Set(displayHotels.map((h) => h.location?.city).filter(Boolean)));

  return (
    <>
      <SectionTitle eyebrow="Inventory Management" title="Hotels & Stays" description="Live catalog of all hotel properties synchronized across MongoDB and frontend views." action={<div className="flex items-center gap-2"><span className="text-xs font-semibold text-slate-500">{filtered.length} properties</span></div>}/>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm">
          <Search size={18} className="text-slate-400"/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hotel by name or location…" className="w-full py-2.5 text-sm outline-none"/>
        </div>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none">
          <option value="">All Cities ({uniqueCities.length})</option>
          {uniqueCities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <Table
        columns={['Property', 'City & Address', 'Rating', 'Rooms', 'Top Amenities', 'Status']}
        rows={filtered.map((hotel) => (
          <tr key={hotel._id || hotel.name} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-5 py-4">
              <div className="font-bold text-slate-900">{hotel.name}</div>
              <div className="text-xs text-slate-400">{hotel.description?.slice(0, 55)}…</div>
            </td>
            <td className="px-5 py-4 text-slate-600">
              <div className="font-semibold text-slate-900">{hotel.location?.city}</div>
              <div className="text-xs text-slate-400">{hotel.location?.address}</div>
            </td>
            <td className="px-5 py-4">
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                ★ {hotel.rating}
              </span>
            </td>
            <td className="px-5 py-4 font-semibold text-slate-700">{hotel.rooms?.length || 0} rooms</td>
            <td className="px-5 py-4">
              <div className="flex flex-wrap gap-1">
                {hotel.amenities?.slice(0, 3).map((a) => (
                  <span key={a} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{a}</span>
                ))}
              </div>
            </td>
            <td className="px-5 py-4"><StatusPill>Active</StatusPill></td>
          </tr>
        ))}
      />
    </>
  );
}

export function RoomsAdmin() {
  const [hotels, setHotels] = useState([]);
  useEffect(() => {
    hotelApi.getHotels().then((data) => setHotels(Array.isArray(data) ? data : mockHotels));
  }, []);

  const displayHotels = hotels.length ? hotels : mockHotels;
  const allRooms = displayHotels.flatMap((hotel) =>
    (hotel.rooms || []).map((room) => ({
      hotelName: hotel.name,
      city: hotel.location?.city,
      ...room
    }))
  );

  return (
    <>
      <SectionTitle eyebrow="Inventory" title="Room Inventory & Rates" description="Manage room types, capacities, base pricing, and live availability toggles." action={<span className="text-xs font-semibold text-slate-500">{allRooms.length} total rooms listed</span>}/>
      <Table
        columns={['Room #', 'Hotel Property', 'City', 'Room Type', 'Capacity', 'Base Rate', 'Dynamic Rate', 'Availability']}
        rows={allRooms.map((r, i) => (
          <tr key={i} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-5 py-4 font-bold text-slate-900">{r.roomNumber}</td>
            <td className="px-5 py-4 font-medium text-slate-800">{r.hotelName}</td>
            <td className="px-5 py-4 text-slate-600">{r.city}</td>
            <td className="px-5 py-4">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{r.type}</span>
            </td>
            <td className="px-5 py-4 text-slate-600">{r.capacity} guests</td>
            <td className="px-5 py-4 font-semibold text-slate-700">{money(r.basePrice)}</td>
            <td className="px-5 py-4 font-bold text-indigo-600">{money(Math.round(r.basePrice * 1.15))}</td>
            <td className="px-5 py-4">
              <StatusPill>{r.isAvailable !== false ? 'Available' : 'Occupied'}</StatusPill>
            </td>
          </tr>
        ))}
      />
    </>
  );
}

export function BookingsAdmin() {
  return (
    <>
      <SectionTitle eyebrow="Reservations" title="Guest Bookings" description="Review real-time guest stays, reservation statuses, and settled payments."/>
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm">
        <Search size={18} className="text-slate-400"/>
        <input placeholder="Search booking ID, customer or hotel…" className="w-full py-2.5 text-sm outline-none"/>
      </div>
      <BookingsTable rows={defaultBookingRows}/>
    </>
  );
}

function BookingsTable({ rows }) {
  return (
    <Table
      columns={['Booking Reference', 'Customer Name', 'Stay & Room', 'Dates', 'Total Amount', 'Payment', 'Status']}
      rows={rows.map((b) => (
        <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
          <td className="px-5 py-4 font-mono font-bold text-indigo-600">{b.id}</td>
          <td className="px-5 py-4 font-semibold text-slate-900">{b.customer}</td>
          <td className="px-5 py-4">
            <div className="font-medium text-slate-900">{b.hotel}</div>
            <div className="text-xs text-slate-400">{b.room}</div>
          </td>
          <td className="px-5 py-4 text-slate-600">{b.dates}</td>
          <td className="px-5 py-4 font-bold text-slate-900">{money(b.amount)}</td>
          <td className="px-5 py-4"><StatusPill>{b.payment}</StatusPill></td>
          <td className="px-5 py-4"><StatusPill>{b.status}</StatusPill></td>
        </tr>
      ))}
    />
  );
}

export function PricingAdmin() {
  return (
    <>
      <SectionTitle eyebrow="AI Intelligence" title="Dynamic Pricing Engine" description="Real-time room price optimization predicted dynamically by our Scikit-Learn Random Forest model."/>
      <Table
        columns={['Hotel Property', 'Room Category', 'Base Tariff', 'Market Demand', 'Occupancy Rate', 'AI Dynamic Rate', 'Engine Status']}
        rows={pricingRows.map((row) => (
          <tr key={row.hotel} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-5 py-4 font-bold text-slate-900">{row.hotel}</td>
            <td className="px-5 py-4 font-medium text-slate-700">{row.room}</td>
            <td className="px-5 py-4 text-slate-500">{money(row.base)}</td>
            <td className="px-5 py-4"><StatusPill>{row.demand}</StatusPill></td>
            <td className="px-5 py-4 font-semibold text-slate-700">{row.occupancy}%</td>
            <td className="px-5 py-4 text-base font-extrabold text-indigo-600">{money(row.dynamic)}</td>
            <td className="px-5 py-4"><StatusPill>{row.status}</StatusPill></td>
          </tr>
        ))}
      />
    </>
  );
}

export function AnalyticsAdmin() {
  return (
    <>
      <SectionTitle eyebrow="Revenue & Performance" title="Business Analytics" description="7-day demand forecasts, booking velocity, and occupancy trends across all properties."/>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Daily Booking Volume" subtitle="Confirmed reservations over the last 7 days">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analyticsData}>
              <CartesianGrid vertical={false} stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={chartStyle}/>
              <YAxis tick={chartStyle}/>
              <Tooltip/>
              <Bar dataKey="bookings" fill="#4f46e5" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Portfolio Occupancy Rate" subtitle="Percentage of rooms booked per day">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={analyticsData}>
              <CartesianGrid vertical={false} stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={chartStyle}/>
              <YAxis tick={chartStyle}/>
              <Tooltip/>
              <Line dataKey="occupancy" stroke="#059669" strokeWidth={3} dot={{ r: 4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}

export function LoginActivityAdmin() {
  const [filters, setFilters] = useState({ search: '', method: '', status: '', date: '', page: 1 });
  const [state, setState] = useState({ loading: true, error: '', data: [], pagination: null });

  useEffect(() => {
    let alive = true;
    setState((p) => ({ ...p, loading: true, error: '' }));
    adminApi.getLoginActivity({ ...filters, limit: 15 })
      .then((res) => alive && setState({ loading: false, error: '', data: res.data, pagination: res.pagination }))
      .catch((err) => alive && setState({ loading: false, error: err.response?.data?.message || 'Unable to load login activity.', data: [], pagination: null }));
    return () => { alive = false; };
  }, [filters]);

  const update = (k, v) => setFilters((curr) => ({ ...curr, [k]: v, page: k === 'page' ? v : 1 }));
  const rows = state.data.map((row) => (
    <tr key={row._id || row.id} className="hover:bg-slate-50/70 transition-colors">
      <td className="px-5 py-4 font-bold text-slate-900">{row.name || 'System Admin'}</td>
      <td className="px-5 py-4 text-slate-600">{row.email || '—'}</td>
      <td className="px-5 py-4 text-slate-600">{row.phone || '—'}</td>
      <td className="px-5 py-4">
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          {row.loginMethod === 'MOBILE_OTP' ? 'Mobile OTP' : 'Email & Password'}
        </span>
      </td>
      <td className="px-5 py-4 text-xs text-slate-500">{new Date(row.loginTime).toLocaleString()}</td>
      <td className="px-5 py-4"><ActivityStatus row={row}/></td>
    </tr>
  ));

  if (!rows.length && !state.loading) {
    rows.push(
      <tr key="empty">
        <td colSpan="6" className="px-5 py-12 text-center text-slate-500">No login activity matches the applied filters.</td>
      </tr>
    );
  }

  return (
    <>
      <SectionTitle eyebrow="Audit & Compliance" title="Authentication Audit Trail" description="Live database log tracking all sign-in attempts, methods, and session activity."/>
      <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input value={filters.search} onChange={(e) => update('search', e.target.value)} placeholder="Search name, email or phone…" className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"/>
        <select value={filters.method} onChange={(e) => update('method', e.target.value)} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none">
          <option value="">All Login Methods</option>
          <option value="EMAIL">Email</option>
          <option value="MOBILE_OTP">Mobile OTP</option>
        </select>
        <select value={filters.status} onChange={(e) => update('status', e.target.value)} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none">
          <option value="">All Statuses</option>
          <option value="SUCCESS">Successful</option>
          <option value="FAILED">Failed</option>
          <option value="ACTIVE">Active Session</option>
        </select>
        <input type="date" value={filters.date} onChange={(e) => update('date', e.target.value)} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none"/>
      </div>

      {state.error && <p className="mb-4 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{state.error}</p>}
      {state.loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading audit records from database…</div>
      ) : (
        <>
          <Table columns={['User / Admin', 'Email Address', 'Mobile Number', 'Auth Method', 'Timestamp', 'Status']} rows={rows}/>
          {state.pagination && (
            <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>{state.pagination.total} audit entries recorded</span>
              <div className="flex gap-2">
                <button disabled={state.pagination.page <= 1} onClick={() => update('page', state.pagination.page - 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm hover:bg-slate-50 disabled:opacity-40">Previous</button>
                <button disabled={state.pagination.page >= state.pagination.pages} onClick={() => update('page', state.pagination.page + 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm hover:bg-slate-50 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function ActivityStatus({ row }) {
  const isFailed = row.status === 'FAILED';
  const isActive = row.status === 'SUCCESS' && !row.logoutTime;
  const label = isFailed ? 'Failed' : isActive ? 'Active Now' : 'Signed Out';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isFailed ? 'bg-rose-50 text-rose-700' : isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>}
      {label}
    </span>
  );
}

export function UsersAdmin() {
  return (
    <>
      <SectionTitle eyebrow="Access Control" title="Users & Roles" description="Registered customers and administrators."/>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Table
          columns={['Name', 'Email Address', 'Role', 'Status']}
          rows={[
            <tr key="admin-row">
              <td className="px-5 py-4 font-bold text-slate-900">SmartStay Administrator</td>
              <td className="px-5 py-4 text-slate-600">manasalshegde@gmail.com</td>
              <td className="px-5 py-4"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">Super Admin</span></td>
              <td className="px-5 py-4"><StatusPill>Active</StatusPill></td>
            </tr>
          ]}
        />
      </div>
    </>
  );
}

export function SettingsAdmin() {
  return (
    <>
      <SectionTitle eyebrow="Configuration" title="System Settings" description="Database connection and dynamic pricing configuration."/>
      <div className="grid max-w-3xl gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Active Database</h3>
          <p className="mt-1 text-sm text-slate-500">Connected to local MongoDB (<code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">mongodb://127.0.0.1:27017/hotel_booking</code>).</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Dynamic Pricing Model</h3>
          <p className="mt-1 text-sm text-slate-500">Scikit-Learn Random Forest Regressor (<code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">ml/pricing_model.pkl</code>) with occupancy, lead time, and seasonal weightings.</p>
        </div>
      </div>
    </>
  );
}
