import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { getTrips } from '../api/tripApi';
import ThemeToggle from '../components/ThemeToggle';

const TABS = ['All', 'Ongoing', 'Upcoming', 'Completed'];

const GRADIENTS = [
  'from-emerald-500/30 to-teal-500/20',
  'from-blue-500/30 to-indigo-500/20',
  'from-purple-500/30 to-pink-500/20',
  'from-orange-500/30 to-red-500/20',
  'from-cyan-500/30 to-sky-500/20',
];

function getStatus(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'ongoing';
}

function getProgress(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

const STATUS_STYLE = {
  upcoming: { pill: 'bg-emerald-500/20 text-emerald-400', bar: 'bg-emerald-500' },
  ongoing:  { pill: 'bg-blue-500/20 text-blue-400',    bar: 'bg-blue-500' },
  completed:{ pill: 'bg-gray-500/20 text-gray-400',    bar: 'bg-gray-500' },
};

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    getTrips().then(setTrips).catch(console.error);
  }, []);

  const filtered = trips.filter(t => {
    if (activeTab === 'All') return true;
    return getStatus(t) === activeTab.toLowerCase();
  });

  const counts = TABS.reduce((acc, tab) => {
    acc[tab] = tab === 'All' ? trips.length : trips.filter(t => getStatus(t) === tab.toLowerCase()).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen relative p-6 lg:p-10 z-10 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <ArrowLeft size={18} /> Dashboard
          </button>
          <ThemeToggle />
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Your Journeys</h1>
          <p className="text-white/50 text-lg">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </motion.div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-white/10'}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Trip Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filtered.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                <p className="text-4xl mb-3">🗺️</p>
                <p className="text-white/40 text-lg">No {activeTab.toLowerCase()} trips</p>
              </div>
            ) : (
              filtered.map((trip, i) => {
                const status = getStatus(trip);
                const progress = getProgress(trip);
                const style = STATUS_STYLE[status];
                const start = new Date(trip.startDate);
                const end = new Date(trip.endDate);
                const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                return (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    className="group flex items-center gap-5 bg-white/5 border border-white/10 rounded-3xl p-5 cursor-pointer hover:bg-white/8 hover:border-white/20 transition-all"
                  >
                    {/* Color swatch */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex-shrink-0 flex items-center justify-center border border-white/10`}>
                      <MapPin size={24} className="text-white/60" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-white text-lg truncate">{trip.title}</h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${style.pill}`}>
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-white/40 text-sm mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} /> {duration} day{duration !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: i * 0.06 + 0.2 }}
                            className={`h-full rounded-full ${style.bar}`}
                          />
                        </div>
                        <span className="text-xs text-white/40 flex-shrink-0">{progress}%</span>
                      </div>
                    </div>

                    <ChevronRight size={20} className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
