import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Save, MapPin, Edit3, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { getTrips } from '../api/tripApi';

const API_BASE = 'http://localhost:5000';

function getStatus(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'ongoing';
}

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || 'Passionate traveler exploring the world one destination at a time ✈️');
  const [editingBio, setEditingBio] = useState(false);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    getTrips().then(setTrips).catch(console.error);
  }, []);

  const avatarSrc = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`)
    : null;

  const initials = user?.name
    ? user.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const preplanned = trips.filter(t => getStatus(t) === 'upcoming');
  const previous   = trips.filter(t => getStatus(t) === 'completed');

  const GRADIENTS = [
    'from-emerald-500/30 to-teal-500/20',
    'from-blue-500/30 to-indigo-500/20',
    'from-purple-500/30 to-pink-500/20',
    'from-orange-500/30 to-red-500/20',
  ];

  const TripGrid = ({ items, label }) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-white mb-4">{label}</h3>
      {items.length === 0 ? (
        <p className="text-white/30 text-sm py-6 text-center border border-dashed border-white/10 rounded-2xl">
          No {label.toLowerCase()} trips
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((trip, i) => (
            <motion.div
              key={trip._id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/trips/${trip._id}`)}
              className={`relative h-32 rounded-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} border border-white/10 cursor-pointer overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm truncate">{trip.title}</p>
                <p className="text-white/50 text-xs">{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-semibold">View</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative p-6 lg:p-10 z-10 text-white">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <ArrowLeft size={18} /> Back
          </button>
          <ThemeToggle />
        </header>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-6"
        >
          {/* Cover gradient */}
          <div className="h-28 bg-gradient-to-br from-emerald-900/60 via-teal-900/40 to-indigo-900/60 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(34,197,94,0.2),transparent_60%)]" />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-12 mb-4 w-fit">
              <div className="w-24 h-24 rounded-full border-4 border-gray-950 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl">
                {avatarSrc
                  ? <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
                  : <span className="text-3xl font-bold text-white">{initials}</span>
                }
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-gray-950 hover:bg-emerald-400 transition-colors">
                <Camera size={14} className="text-white" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
                <div className="flex items-center gap-2 text-white/40 text-sm mt-1">
                  <Mail size={13} /> {user?.email}
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm mt-1">
                  <MapPin size={13} />
                  <span className="capitalize">{user?.role || 'Traveler'}</span>
                  <span>·</span>
                  <span>{trips.length} trips</span>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                Sign Out
              </button>
            </div>

            {/* Bio */}
            <div className="mt-4">
              {editingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setEditingBio(false)}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      <Save size={14} /> Save
                    </button>
                    <button onClick={() => setEditingBio(false)}
                      className="px-4 py-2 bg-white/5 border border-white/10 text-white/50 rounded-xl text-sm hover:bg-white/10 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 group">
                  <p className="text-white/60 text-sm leading-relaxed flex-1">{bio}</p>
                  <button onClick={() => setEditingBio(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-white/30 hover:text-white">
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Trips', value: trips.length },
            { label: 'Upcoming',    value: preplanned.length },
            { label: 'Completed',   value: previous.length },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-2xl font-extrabold text-emerald-400">{stat.value}</p>
              <p className="text-white/40 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trip Grids */}
        <TripGrid items={preplanned} label="Preplanned Trips" />
        <TripGrid items={previous}   label="Previous Trips" />
      </div>
    </div>
  );
}
