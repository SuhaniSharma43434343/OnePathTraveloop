import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { Plane, Plus, Compass, User, ShieldCheck, Search, SlidersHorizontal, MapPin, Calendar, TrendingUp, Users } from 'lucide-react';
import CreateTripModal from '../components/CreateTripModal';
import { getTrips } from '../api/tripApi';
import LottieOverlay from '../components/LottieOverlay';
import useLottieTransition from '../components/useLottieTransition';
import useLottieData from '../components/useLottieData';

const REGIONS = [
  { name: 'Bali',     emoji: '🌴', from: 'rgba(0,180,216,0.2)',  to: 'rgba(0,53,102,0.12)' },
  { name: 'Paris',    emoji: '🗼', from: 'rgba(0,119,182,0.2)',  to: 'rgba(0,30,80,0.12)' },
  { name: 'Kyoto',    emoji: '⛩️', from: 'rgba(0,150,199,0.2)', to: 'rgba(0,53,102,0.12)' },
  { name: 'Maldives', emoji: '🏝️', from: 'rgba(0,212,255,0.2)', to: 'rgba(0,119,182,0.12)' },
  { name: 'Manali',   emoji: '🏔️', from: 'rgba(144,224,239,0.2)',to: 'rgba(0,119,182,0.12)' },
];

const FILTERS = ['All', 'Upcoming', 'Beach', 'Mountains', 'City'];

const STATUS = {
  upcoming:  { pill: 'text-sky-300',   bg: 'rgba(0,180,216,0.15)',  border: 'rgba(0,180,216,0.3)' },
  ongoing:   { pill: 'text-blue-300',  bg: 'rgba(0,119,182,0.15)',  border: 'rgba(0,119,182,0.3)' },
  completed: { pill: 'text-slate-400', bg: 'rgba(100,116,139,0.12)',border: 'rgba(100,116,139,0.2)' },
};

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips]         = useState([]);
  const [isModalOpen, setModal]   = useState(false);
  const [search, setSearch]       = useState('');
  const [activeFilter, setFilter] = useState('All');
  const { showOverlay, run, handleDone } = useLottieTransition();
  const airplaneData = useLottieData('/lottie/airplane.json');

  const navigateWithPlane = (path) => {
    run(
      () => new Promise(resolve => setTimeout(resolve, 0)),
      () => navigate(path)
    );
  };

  useEffect(() => { getTrips().then(setTrips).catch(console.error); }, []);

  const handleTripCreated = (t) => setTrips(p => [t, ...p]);

  const filtered = trips.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen text-slate-100 relative overflow-x-hidden">

      {airplaneData && (
        <LottieOverlay
          animationData={airplaneData}
          show={showOverlay}
          onDone={handleDone}
          minDuration={1200}
          skipThreshold={300}
          loop={false}
          label="Navigating to your destination"
        />
      )}

      {/* ── Nav ── */}
      <header className="w-full flex items-center justify-between px-6 py-4 z-50 relative"
        style={{ borderBottom: '1px solid rgba(0,180,216,0.1)', backdropFilter: 'blur(20px)', background: 'rgba(0,27,46,0.5)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgba(0,119,182,0.4),rgba(0,53,102,0.5))', border: '1px solid rgba(0,180,216,0.3)' }}>
            <Plane size={16} className="text-sky-300" />
          </div>
          <span className="text-lg font-light tracking-widest uppercase" style={{ color: '#90e0ef' }}>Traveloop</span>
        </div>

        <div className="flex items-center gap-2">
          {[
            { icon: <Users size={18} />,      path: '/community', tip: 'Community' },
            { icon: <ShieldCheck size={18} />, path: '/admin',     tip: 'Admin' },
            { icon: <User size={18} />,        path: '/profile',   tip: 'Profile' },
          ].map(({ icon, path, tip }) => (
            <button key={path} onClick={() => navigateWithPlane(path)} title={tip}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ border: '1px solid rgba(0,180,216,0.12)', color: '#4fc3f7' }}
              onMouseEnter={e => e.currentTarget.style.color = '#00b4d8'}
              onMouseLeave={e => e.currentTarget.style.color = '#4fc3f7'}>
              {icon}
            </button>
          ))}
          <ThemeToggle />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full ml-1"
            style={{ background: 'rgba(0,119,182,0.1)', border: '1px solid rgba(0,180,216,0.15)' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#0077b6,#0096c7)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-light hidden sm:block" style={{ color: '#90e0ef' }}>{user?.name?.split(' ')[0]}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="text-xs text-slate-500 hover:text-red-400 transition-colors ml-1">
              out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-12">

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ minHeight: 'clamp(320px, 45vw, 480px)', border: '1px solid rgba(0,180,216,0.15)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
        >
          {/* Beach background image */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
            alt="Beach"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />
          {/* Gradient: strong left cover on md+, full cover on mobile */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(0,27,46,0.55) 0%, rgba(0,27,46,0.85) 100%)'
          }} />
          <div className="absolute inset-0 hidden md:block" style={{
            background: 'linear-gradient(90deg, rgba(0,27,46,0.0) 0%, rgba(0,27,46,0.0) 0%)'
          }} />

          {/* Layout: stacked on mobile, side-by-side on md+ */}
          <div className="relative z-10 h-full flex flex-col md:flex-row md:items-stretch">

            {/* White water card — full width mobile, left panel md+ */}
            <motion.div
              initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="water-hero-card-responsive"
            >
              <p className="hero-label mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
              <h1 className="hero-heading mb-3">
                Plan. Explore.<br />
                <span style={{ background: 'linear-gradient(135deg,#0077b6,#00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Discover.
                </span>
              </h1>
              <p className="hero-sub mb-5">
                {trips.length} trip{trips.length !== 1 ? 's' : ''} planned · Your next adventure awaits
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setModal(true)}
                  className="btn-nature px-6 py-2.5 text-sm font-semibold flex items-center gap-2"
                >
                  <Plus size={15} /> Plan a Trip
                </button>
                {/* Inline stats on mobile (hidden on md where they show top-right) */}
                <div className="flex gap-3 md:hidden">
                  {[{ val: trips.length, label: 'Trips' }, { val: 12, label: 'Spots' }].map(s => (
                    <div key={s.label} className="text-center px-3 py-1.5 rounded-xl"
                      style={{ background: 'rgba(0,27,46,0.5)', border: '1px solid rgba(0,180,216,0.2)' }}>
                      <p className="text-lg font-light" style={{ color: '#00b4d8' }}>{s.val}</p>
                      <p className="text-xs" style={{ color: '#4fc3f7' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Spacer so image shows on right on md+ */}
            <div className="hidden md:flex flex-1" />
          </div>

          {/* Stats — top-right, desktop only */}
          <div className="absolute top-5 right-5 hidden md:flex gap-3">
            {[{ val: trips.length, label: 'Trips', color: '#00b4d8' }, { val: 12, label: 'Destinations', color: '#90e0ef' }].map(s => (
              <div key={s.label} className="text-center px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(0,27,46,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,180,216,0.2)' }}>
                <p className="text-xl font-light" style={{ color: s.color }}>{s.val}</p>
                <p className="text-xs font-light" style={{ color: '#4fc3f7' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Upcoming Adventures Progress Bars ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="label-nature mb-1">In Progress</p>
              <h2 className="text-xl font-light" style={{ color: 'var(--text-primary)' }}>Upcoming Adventures</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Swiss Alps Escape',    progress: 80, color: '#fbbf24', img: 'swiss+alps+mountains' },
              { title: 'Kyoto Heritage',        progress: 45, color: '#34d399', img: 'kyoto+japan+temple' },
              { title: 'Bali Island Getaway',   progress: 15, color: '#38bdf8', img: 'bali+beach+tropical' },
            ].map((adv, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="glass-panel p-4 cursor-pointer group">
                <div className="h-40 rounded-xl overflow-hidden mb-4">
                  <img
                    src={`https://images.unsplash.com/featured/?${adv.img}&auto=format&fit=crop&w=600&q=70`}
                    alt={adv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{adv.title}</h3>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${adv.progress}%`, background: adv.color, boxShadow: `0 0 8px ${adv.color}80` }} />
                </div>
                <p className="text-xs mt-2 font-light" style={{ color: 'var(--text-muted)' }}>{adv.progress}% Complete</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Search + Filters ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={17} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations, trips..."
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 outline-none text-sm font-light transition-all"
                style={{ background: 'rgba(0,119,182,0.06)', border: '1px solid rgba(0,180,216,0.12)', backdropFilter: 'blur(12px)', color: '#e0f2f1' }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,180,216,0.45)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,180,216,0.12)'}
              />
            </div>
            <button className="px-5 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-light transition-all"
              style={{ background: 'rgba(0,119,182,0.08)', border: '1px solid rgba(0,180,216,0.12)', color: '#4fc3f7' }}>
              <SlidersHorizontal size={16} /> Filter
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-sm font-light whitespace-nowrap transition-all"
                style={activeFilter === f
                  ? { background: 'linear-gradient(135deg,#0077b6,#0096c7)', color: '#fff', boxShadow: '0 4px 16px rgba(0,119,182,0.4)' }
                  : { background: 'rgba(0,119,182,0.08)', border: '1px solid rgba(0,180,216,0.12)', color: '#4fc3f7' }
                }>
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Regional Selections ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="label-nature mb-1">Discover</p>
              <h2 className="text-xl font-light text-slate-200 flex items-center gap-2">
                <TrendingUp size={18} style={{ color: '#00b4d8' }} /> Top Regional Selections
              </h2>
            </div>
            <button className="text-sm font-light transition-colors" style={{ color: '#00b4d8' }}>See all →</button>
          </div>
          <motion.div variants={stagger.container} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {REGIONS.map((r, i) => (
              <motion.div key={r.name} variants={stagger.item} transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.06, y: -6 }} whileTap={{ scale: 0.97 }}
                className="aspect-square rounded-2xl cursor-pointer flex flex-col items-center justify-center gap-2 transition-all"
                style={{ background: `radial-gradient(circle at 30% 30%, ${r.from}, ${r.to})`, border: '1px solid rgba(0,180,216,0.12)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
              >
                <span className="text-4xl">{r.emoji}</span>
                <span className="text-xs font-light tracking-wider text-slate-300 uppercase">{r.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Trip Cards ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="label-nature mb-1">Your Journeys</p>
              <h2 className="text-xl font-light text-slate-200 flex items-center gap-2">
                <Compass size={18} style={{ color: '#00b4d8' }} /> Recent Trips
              </h2>
            </div>
            <button onClick={() => navigate('/my-trips')} className="text-sm font-light transition-colors" style={{ color: '#00b4d8' }}>View all →</button>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center rounded-3xl" style={{ border: '1px dashed rgba(0,180,216,0.15)' }}>
              <p className="text-4xl mb-3">🌊</p>
              <p className="text-slate-500 font-light">No trips yet. Start your journey.</p>
            </div>
          ) : (
            <motion.div variants={stagger.container} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((trip, i) => {
                const start = new Date(trip.startDate);
                const end   = new Date(trip.endDate);
                const now   = new Date();
                const status = now < start ? 'upcoming' : now > end ? 'completed' : 'ongoing';
                const duration = Math.ceil((end - start) / 86400000);
                const s = STATUS[status];
                return (
                  <motion.div key={trip._id} variants={stagger.item}
                    whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigateWithPlane(`/trips/${trip._id}`)}
                    className="glass-panel p-5 cursor-pointer group"
                  >
                    {/* Card visual */}
                    <div className="h-28 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                      style={{ background: 'radial-gradient(circle at 30% 50%, rgba(0,119,182,0.2), rgba(0,27,46,0.1))', border: '1px solid rgba(0,180,216,0.08)' }}>
                      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(56,189,248,0.06), transparent)' }} />
                      <MapPin size={28} style={{ color: 'rgba(0,180,216,0.45)' }} />
                    </div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-light text-slate-200 text-base leading-tight">{trip.title}</h3>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full capitalize flex-shrink-0 ml-2"
                        style={{ background: s.bg, color: s.pill, border: `1px solid ${s.border}` }}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-xs font-light">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>·</span>
                      <span>{duration} day{duration !== 1 ? 's' : ''}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.section>
      </main>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08, boxShadow: '0 12px 40px rgba(0,119,182,0.7)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setModal(true)}
        className="fixed bottom-8 right-8 z-50 px-6 py-3.5 rounded-full text-white font-medium text-sm flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg,#0077b6,#0096c7)', boxShadow: '0 8px 32px rgba(0,119,182,0.5)' }}
      >
        <Plus size={18} /> Plan a Trip
      </motion.button>

      <CreateTripModal isOpen={isModalOpen} onClose={() => setModal(false)} onTripCreated={handleTripCreated} />
    </div>
  );
}
