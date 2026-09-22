import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Users,
  X,
  Sparkles,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export function PublicNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {}
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-white tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <Building2 size={20} />
          </span>
          <span>Smart<span className="text-indigo-400">Stay</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden gap-8 text-sm font-semibold text-slate-300 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'text-indigo-400 font-bold' : 'hover:text-white transition'
            }
          >
            Discover
          </NavLink>
          <NavLink
            to="/hotels"
            className={({ isActive }) =>
              isActive ? 'text-indigo-400 font-bold' : 'hover:text-white transition'
            }
          >
            Hotels
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              isActive ? 'text-indigo-400 font-bold' : 'hover:text-white transition'
            }
          >
            Dynamic Pricing
          </NavLink>
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden items-center gap-3.5 sm:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-300 hover:text-white transition"
              >
                My stays
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold text-indigo-300 shadow-sm transition hover:bg-indigo-500/20"
                >
                  <ShieldCheck size={14} /> Admin Workspace
                </Link>
              )}
              <button
                onClick={signOut}
                title="Sign out"
                className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950 px-5 py-4 md:hidden space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            Discover
          </Link>
          <Link
            to="/hotels"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            Hotels
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            Dynamic Pricing
          </Link>
          <div className="border-t border-slate-800 pt-3">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-slate-300"
                >
                  My stays
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-bold text-indigo-400"
                  >
                    Admin Workspace
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm text-rose-400 pt-2"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-300 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const regions = [
    { name: 'Goa', path: '/hotels?city=Goa' },
    { name: 'Mumbai', path: '/hotels?city=Mumbai' },
    { name: 'Bengaluru', path: '/hotels?city=Bengaluru' },
    { name: 'Delhi NCR', path: '/hotels?city=Delhi' },
    { name: 'Rajasthan / Jaipur', path: '/hotels?city=Jaipur' },
    { name: 'Kerala / Kochi', path: '/hotels?city=Kerala' },
    { name: 'Himachal / Manali', path: '/hotels?city=Manali' }
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-white tracking-tight">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-md">
                <Building2 size={20} />
              </span>
              <span>Smart<span className="text-indigo-400">Stay</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Next-generation luxury hotel booking platform powered by real-time Machine Learning dynamic rate intelligence across 70+ properties in India.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                <Cpu size={13} className="text-indigo-400" /> FastAPI + Scikit-Learn
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                <Layers size={13} className="text-emerald-400" /> PostgreSQL / Supabase
              </span>
            </div>
          </div>

          {/* Quick Regions */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Explore Premier Destinations (10+ Stays Each)
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {regions.map((r) => (
                <li key={r.name}>
                  <Link to={r.path} className="hover:text-indigo-400 transition flex items-center gap-1.5">
                    <MapPin size={13} className="text-indigo-500" /> {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Admin Link */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform & Administration
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/hotels" className="hover:text-white transition">
                  Browse All 70+ Stays
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition">
                  AI Dynamic Pricing Playground
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Guest & Admin Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  <ShieldCheck size={15} /> Operations Control Workspace
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/80 pt-8 text-xs text-slate-500">
          <p>© 2026 SmartStay Technologies Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built for CBA Training · Designed with <Sparkles size={13} className="text-amber-400" /> AI
          </p>
        </div>
      </div>
    </footer>
  );
}

const adminLinks = [
  ['/admin', 'Overview', LayoutDashboard],
  ['/admin/hotels', 'Hotels', Building2],
  ['/admin/rooms', 'Rooms', Moon],
  ['/admin/bookings', 'Bookings', ShieldCheck],
  ['/admin/pricing', 'Pricing Intelligence', TrendingUp],
  ['/admin/login-activity', 'Login Activity', ShieldCheck],
  ['/admin/users', 'Users & Staff', Users],
  ['/admin/analytics', 'Revenue Analytics', LayoutDashboard],
  ['/admin/settings', 'Settings', Menu]
];

export function AdminShell({ children }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {}
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-white lg:hidden shadow-xl"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-950 p-5 text-slate-300 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/admin" className="mb-10 flex items-center gap-2.5 text-xl font-bold text-white tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Building2 size={20} />
          </span>
          <span>Smart<span className="text-indigo-400">Stay</span></span>
        </Link>

        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          Administration
        </p>

        <nav className="space-y-1">
          {adminLinks.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              end={to === '/admin'}
              onClick={() => setOpen(false)}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'hover:bg-slate-900 hover:text-white text-slate-400'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 border-t border-slate-800 pt-4 flex items-center justify-between">
          <Link to="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <ExternalLink size={13} /> View Website
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-64 flex-1 flex flex-col">
        <header className="flex h-18 items-center justify-between border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl px-6 pl-16 lg:pl-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Operations Hub</p>
            <h1 className="text-lg font-bold text-white">Hotel Management Center</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-bold text-indigo-300">
            <ShieldCheck size={16} /> Administrator
          </div>
        </header>

        <div className="p-5 sm:p-8 flex-1 bg-slate-950">{children}</div>
      </main>
    </div>
  );
}
