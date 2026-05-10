import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { Plane, Plus, Compass, User, ShieldCheck, Search, SlidersHorizontal, MapPin, Calendar, TrendingUp, Users } from 'lucide-react';
import CreateTripModal from '../components/CreateTripModal';
import { getTrips } from '../api/tripApi';

const REGIONS = [
  { name: 'Bali', emoji: '🌴', color: 'from-emerald-500/30 to-teal-500/20' },
  { name: 'Paris', emoji: '🗼', color: 'from-blue-500/30 to-indigo-500/20' },
  { name: 'Kyoto', emoji: '⛩️', color: 'from-red-500/30 to-pink-500/20' },
  { name: 'Maldives', emoji: '🏝️', color: 'from-cyan-500/30 to-sky-500/20' },
  { name: 'Manali', emoji: '🏔️', color: 'from-purple-500/30 to-violet-500/20' },
];

const FILTERS = ['All', 'Upcoming', 'Beach', 'Mountains', 'City'];

const STATUS_COLOR = {
  upcoming: 'bg-emerald-500/20 text-emerald-400',
  ongoing: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-gray-500/20 text-gray-400',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    getTrips().then(setTrips).catch(console.error);
  }, []);

  const handleTripCreated = (newTrip) => setTrips([newTrip, ...trips]);

  const filteredTrips = trips.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      {/* Nav */}
      <header className="w-full flex items-center justify-between px-6 py-4 z-50 relative border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
          <Plane size={28} className="text-emerald-400" />
          Traveloop
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/community')} className="p-2 text-white/50 hover:text-white transition-colors" title="Community">
            <Users size={20} />
          </button>
          <button onClick={() => navigate('/admin')} className="p-2 text-white/50 hover:text-white transition-colors" title="Admin">
            <ShieldCheck size={20} />
          </button>
          <button onClick={() => navigate('/profile')} className="p-2 text-white/50 hover:text-white transition-colors" title="Profile">
            <User size={20} />
          </button>
          <ThemeToggle />
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-white/80 hidden sm:block">{user?.name?.split(' ')[0]}</span>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors ml-1"
            >Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative h-64 md:h-80 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-teal-900/40 to-indigo-900/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(34,197,94,0.2),transparent_60%)]" />
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative z-10 h-full flex flex-col justify-center px-10">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-400 font-semibold text-sm tracking-widest uppercase mb-3"
            >
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
            >
              Explore the <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                World
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-lg"
            >
              {trips.length} trip{trips.length !== 1 ? 's' : ''} planned · Your next adventure awaits
            </motion.p>
          </div>
          {/* Stats pill */}
          <div className="absolute top-6 right-6 flex gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-emerald-400">{trips.length}</p>
              <p className="text-xs text-white/50">Trips</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-teal-400">12</p>
              <p className="text-xs text-white/50">Destinations</p>
            </div>
          </div>
        </motion.div>

        {/* ── Search Bar + Filter Chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations, trips..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <button className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filter
            </button>
          </div>
          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeFilter === f
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Top Regional Selections (Horizontal Scroll) ── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-400" /> Top Regional Selections
            </h2>
            <button className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors">See all</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {REGIONS.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${region.color} border border-white/10 cursor-pointer flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-all shadow-lg`}
              >
                <span className="text-4xl">{region.emoji}</span>
                <span className="text-sm font-bold text-white/80">{region.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Trip Cards (Vertical) ── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Compass size={20} className="text-teal-400" /> Your Trips
            </h2>
            <button onClick={() => navigate('/my-trips')} className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors">View all</button>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-4xl mb-3">🌍</p>
              <p className="text-white/50 text-lg">No trips yet. Start planning!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrips.map((trip, i) => {
                const start = new Date(trip.startDate);
                const end = new Date(trip.endDate);
                const now = new Date();
                const status = now < start ? 'upcoming' : now > end ? 'completed' : 'ongoing';
                const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                return (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 cursor-pointer hover:bg-white/8 hover:border-white/20 transition-all shadow-lg group"
                  >
                    {/* Card header gradient */}
                    <div className="h-28 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-white/5 mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.15),transparent)]" />
                      <MapPin size={32} className="text-emerald-400/60" />
                    </div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-white text-lg leading-tight">{trip.title}</h3>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[status]}`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-white/40 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-white/20">·</span>
                      <span>{duration} day{duration !== 1 ? 's' : ''}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </main>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3.5 rounded-full font-bold shadow-2xl shadow-emerald-500/40 flex items-center gap-2 hover:shadow-emerald-500/60 transition-shadow"
      >
        <Plus size={20} /> Plan a Trip
      </motion.button>

      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTripCreated={handleTripCreated}
      />
    </div>
  );
}
