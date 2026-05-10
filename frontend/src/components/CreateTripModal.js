import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Sparkles } from 'lucide-react';
import { createTrip } from '../api/tripApi';

const DESTINATIONS = [
  'Bali, Indonesia', 'Paris, France', 'Manali, India', 'Santorini, Greece',
  'Kyoto, Japan', 'Machu Picchu, Peru', 'Goa, India', 'Dubai, UAE',
  'Ladakh, India', 'New York, USA', 'Maldives', 'Rajasthan, India',
];

const ACTIVITY_SUGGESTIONS = {
  'Bali, Indonesia':    [{ icon: '🌊', label: 'Surfing' }, { icon: '🛕', label: 'Temple Tour' }, { icon: '🌿', label: 'Rice Terraces' }],
  'Paris, France':      [{ icon: '🗼', label: 'Eiffel Tower' }, { icon: '🎨', label: 'Louvre Museum' }, { icon: '🥐', label: 'Café Hopping' }],
  'Kyoto, Japan':       [{ icon: '⛩️', label: 'Fushimi Inari' }, { icon: '🌸', label: 'Cherry Blossoms' }, { icon: '🍵', label: 'Tea Ceremony' }],
  'Maldives':           [{ icon: '🤿', label: 'Snorkeling' }, { icon: '🏝️', label: 'Island Hopping' }, { icon: '🌅', label: 'Sunset Cruise' }],
  'Manali, India':      [{ icon: '🏔️', label: 'Trekking' }, { icon: '🎿', label: 'Skiing' }, { icon: '🏕️', label: 'Camping' }],
  default:              [{ icon: '🗺️', label: 'Sightseeing' }, { icon: '🍽️', label: 'Local Cuisine' }, { icon: '📸', label: 'Photography' }],
};

export default function CreateTripModal({ isOpen, onClose, onTripCreated }) {
  const [form, setForm] = useState({ title: '', destination: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const suggestions = ACTIVITY_SUGGESTIONS[form.destination] || ACTIVITY_SUGGESTIONS.default;

  const toggleActivity = (label) => {
    setSelectedActivities(prev =>
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newTrip = await createTrip({
        title: form.title || form.destination,
        description: selectedActivities.join(', '),
        startDate: form.startDate,
        endDate: form.endDate,
      });
      onTripCreated(newTrip);
      onClose();
      setForm({ title: '', destination: '', startDate: '', endDate: '' });
      setSelectedActivities([]);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-gray-950/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-teal-500/5">
            <div>
              <h2 className="text-2xl font-bold text-white">Plan New Trip</h2>
              <p className="text-white/40 text-sm mt-0.5">Where are you headed?</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
              <X size={18} className="text-white/60" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Trip Title */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Trip Name</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Summer in Kyoto"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            {/* Location Select */}
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2 flex items-center gap-1.5">
                <MapPin size={14} /> Destination
              </label>
              <select
                required
                value={form.destination}
                onChange={e => { setForm({ ...form, destination: e.target.value }); setSelectedActivities([]); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              >
                <option value="" className="bg-gray-900">Select a destination...</option>
                {DESTINATIONS.map(d => (
                  <option key={d} value={d} className="bg-gray-900">{d}</option>
                ))}
              </select>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2 flex items-center gap-1.5">
                  <Calendar size={14} /> Start Date
                </label>
                <input
                  type="date" required
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2 flex items-center gap-1.5">
                  <Calendar size={14} /> End Date
                </label>
                <input
                  type="date" required
                  value={form.endDate}
                  min={form.startDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Activity Suggestion Cards */}
            {form.destination && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="block text-sm font-semibold text-white/60 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-400" /> Suggested Activities
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {suggestions.map(act => (
                    <button
                      key={act.label}
                      type="button"
                      onClick={() => toggleActivity(act.label)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedActivities.includes(act.label)
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{act.icon}</div>
                      <div className="text-xs font-semibold">{act.label}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading || !form.destination || !form.startDate || !form.endDate}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</>
                : 'Create Trip'
              }
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
