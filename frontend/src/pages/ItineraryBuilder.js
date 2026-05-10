import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Plane, Hotel, Zap, Trash2, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const SECTION_TYPES = [
  { type: 'travel',   label: 'Travel',   icon: <Plane size={18} />,  color: 'from-blue-500/20 to-indigo-500/10',   border: 'border-blue-500/30',   accent: 'text-blue-400' },
  { type: 'hotel',    label: 'Hotel',    icon: <Hotel size={18} />,  color: 'from-purple-500/20 to-violet-500/10', border: 'border-purple-500/30', accent: 'text-purple-400' },
  { type: 'activity', label: 'Activity', icon: <Zap size={18} />,    color: 'from-emerald-500/20 to-teal-500/10',  border: 'border-emerald-500/30',accent: 'text-emerald-400' },
];

let nextId = 1;

function newSection(type) {
  return { id: nextId++, type, title: '', startDate: '', endDate: '', budget: '', notes: '', collapsed: false };
}

export default function ItineraryBuilder() {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('');
  const [sections, setSections] = useState([newSection('travel')]);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const addSection = (type) => {
    setSections(s => [...s, newSection(type)]);
    setShowTypeMenu(false);
  };

  const updateSection = (id, field, value) => {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
  };

  const removeSection = (id) => setSections(s => s.filter(sec => sec.id !== id));
  const toggleCollapse = (id) => setSections(s => s.map(sec => sec.id === id ? { ...sec, collapsed: !sec.collapsed } : sec));

  const totalBudget = sections.reduce((sum, s) => sum + (parseFloat(s.budget) || 0), 0);

  return (
    <div className="min-h-screen relative p-6 lg:p-10 z-10 text-white">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <ThemeToggle />
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Build Itinerary</h1>
          <p className="text-white/40">Add travel, hotel, and activity sections</p>
        </motion.div>

        {/* Trip Name */}
        <div className="mb-6">
          <input
            value={tripName}
            onChange={e => setTripName(e.target.value)}
            placeholder="Itinerary name (e.g., Bali Adventure 2025)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xl font-bold placeholder-white/20 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        {/* Budget Summary */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-8">
          <span className="text-white/50 text-sm font-semibold">Total Estimated Budget</span>
          <span className="text-emerald-400 font-bold text-xl">${totalBudget.toFixed(2)}</span>
        </div>

        {/* Sections */}
        <div className="space-y-4 mb-24">
          <AnimatePresence>
            {sections.map((sec, i) => {
              const meta = SECTION_TYPES.find(t => t.type === sec.type);
              return (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-gradient-to-br ${meta.color} border ${meta.border} rounded-3xl overflow-hidden`}
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className={meta.accent}>{meta.icon}</span>
                      <span className={`font-bold ${meta.accent}`}>{meta.label}</span>
                      {sec.title && <span className="text-white/60 text-sm">· {sec.title}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {sec.budget && (
                        <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-white/60">
                          ${sec.budget}
                        </span>
                      )}
                      <button onClick={() => toggleCollapse(sec.id)} className="p-1.5 text-white/30 hover:text-white transition-colors">
                        {sec.collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                      </button>
                      <button onClick={() => removeSection(sec.id)} className="p-1.5 text-red-400/50 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Section Body */}
                  <AnimatePresence>
                    {!sec.collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 space-y-3 overflow-hidden"
                      >
                        <input
                          value={sec.title}
                          onChange={e => updateSection(sec.id, 'title', e.target.value)}
                          placeholder={`${meta.label} name (e.g., ${sec.type === 'travel' ? 'Flight to Bali' : sec.type === 'hotel' ? 'The Ritz Carlton' : 'Surfing Lesson'})`}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-3.5 text-white/30" />
                            <input
                              type="date"
                              value={sec.startDate}
                              onChange={e => updateSection(sec.id, 'startDate', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm [color-scheme:dark]"
                            />
                          </div>
                          <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-3.5 text-white/30" />
                            <input
                              type="date"
                              value={sec.endDate}
                              min={sec.startDate}
                              onChange={e => updateSection(sec.id, 'endDate', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm [color-scheme:dark]"
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <DollarSign size={14} className="absolute left-3 top-3.5 text-white/30" />
                          <input
                            type="number" min="0"
                            value={sec.budget}
                            onChange={e => updateSection(sec.id, 'budget', e.target.value)}
                            placeholder="Estimated budget"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                          />
                        </div>
                        <textarea
                          value={sec.notes}
                          onChange={e => updateSection(sec.id, 'notes', e.target.value)}
                          placeholder="Notes (confirmation number, address, etc.)"
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm resize-none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB — Add Section */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showTypeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex flex-col gap-2 bg-gray-950/95 border border-white/10 rounded-2xl p-3 shadow-2xl"
            >
              {SECTION_TYPES.map(t => (
                <button
                  key={t.type}
                  onClick={() => addSection(t.type)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r ${t.color} border ${t.border} ${t.accent} font-semibold text-sm hover:opacity-90 transition-opacity`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowTypeMenu(v => !v)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-14 h-14 rounded-full font-bold shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:shadow-emerald-500/60 transition-shadow"
        >
          <Plus size={24} className={`transition-transform ${showTypeMenu ? 'rotate-45' : ''}`} />
        </motion.button>
      </div>
    </div>
  );
}
