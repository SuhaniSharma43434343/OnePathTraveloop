import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ArrowLeft, MapPin, Plus, Clock, Wallet, CheckSquare, FileText,
  Map as MapIcon, Sparkles, Loader2, GripVertical, CloudRain, Sun,
  Download, Map as Map2, DollarSign, ArrowDown
} from 'lucide-react';
import { getStops, createStop, getActivities, createActivity } from '../api/itineraryApi';
import ThemeToggle from '../components/ThemeToggle';
import BudgetView from '../components/BudgetView';
import ChecklistView from '../components/ChecklistView';
import NotesView from '../components/NotesView';
import MapView from '../components/MapView';

const mockCoordinates = {
  'Tokyo': { lat: 35.68, lng: 139.65 }, 'Kyoto': { lat: 35.01, lng: 135.76 },
  'Paris': { lat: 48.85, lng: 2.35 },   'London': { lat: 51.50, lng: -0.12 },
  'New York': { lat: 40.71, lng: -74.00 }, 'Bali': { lat: -8.34, lng: 115.09 },
};

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [weatherMap, setWeatherMap] = useState({});
  const [newCity, setNewCity] = useState('');
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isGenerating, setIsGenerating] = useState(null);

  useEffect(() => { loadStops(); }, [id]);

  const loadStops = async () => {
    const fetched = await getStops(id);
    setStops(fetched);
    fetched.forEach(s => { loadActivities(s); loadWeather(s); });
  };

  const loadWeather = async (stop) => {
    try {
      const coords = mockCoordinates[stop.city];
      if (!coords) return;
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true`);
      const data = await res.json();
      setWeatherMap(prev => ({ ...prev, [stop._id]: data.current_weather }));
    } catch {}
  };

  const loadActivities = async (stop) => {
    const acts = await getActivities(stop._id);
    setActivitiesMap(prev => ({ ...prev, [stop._id]: acts }));
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    const s = await createStop({ trip: id, city: newCity, order: stops.length });
    setStops([...stops, s]);
    setNewCity('');
  };

  const handleAddActivity = async (stopId) => {
    const title = prompt('Activity Title:');
    if (!title) return;
    const cost = prompt('Estimated Cost ($):', '0');
    const act = await createActivity({ stop: stopId, title, cost: Number(cost) });
    setActivitiesMap(prev => ({ ...prev, [stopId]: [...(prev[stopId] || []), act] }));
  };

  const handleMagicFill = async (stopId, cityName) => {
    setIsGenerating(stopId);
    await new Promise(r => setTimeout(r, 1500));
    const mockActs = [
      { title: `Explore Downtown ${cityName}`, cost: 0 },
      { title: 'Local Cuisine Tasting', cost: 45 },
      { title: 'Guided Historic Walking Tour', cost: 25 },
    ];
    let added = [];
    for (let act of mockActs) {
      const a = await createActivity({ stop: stopId, ...act });
      added.push(a);
    }
    setActivitiesMap(prev => ({ ...prev, [stopId]: [...(prev[stopId] || []), ...added] }));
    setIsGenerating(null);
  };

  const exportPDF = async () => {
    const el = document.getElementById('itinerary-export-area');
    if (!el) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({ margin: 10, filename: 'Traveloop_Itinerary.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4' } }).from(el).save();
  };

  const tabs = [
    { id: 'itinerary', label: 'Itinerary',  icon: <MapIcon size={16} /> },
    { id: 'map',       label: 'Route Map',  icon: <Map2 size={16} /> },
    { id: 'budget',    label: 'Budget',     icon: <Wallet size={16} /> },
    { id: 'checklist', label: 'Checklist',  icon: <CheckSquare size={16} /> },
    { id: 'notes',     label: 'Notes',      icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen relative p-6 lg:p-10 z-10 text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <button onClick={() => navigate('/my-trips')}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <ArrowLeft size={18} /> My Trips
          </button>
          <div className="flex gap-3">
            <button onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full font-bold hover:bg-emerald-500/30 transition-colors text-sm">
              <Download size={16} /> Export PDF
            </button>
            <ThemeToggle />
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            Trip Command Center
          </h1>
          <p className="text-white/40">Manage every aspect of your journey.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>

            {activeTab === 'itinerary' && (
              <div id="itinerary-export-area" className="space-y-2">
                <Reorder.Group axis="y" values={stops} onReorder={setStops} className="space-y-2">
                  {stops.map((stop, dayIdx) => {
                    const acts = activitiesMap[stop._id] || [];
                    const totalCost = acts.reduce((s, a) => s + (a.cost || 0), 0);
                    return (
                      <React.Fragment key={stop._id}>
                        <Reorder.Item value={stop} className="cursor-grab active:cursor-grabbing">
                          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all">
                            {/* Day Header */}
                            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                <GripVertical size={18} className="text-white/20" />
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                                  {dayIdx + 1}
                                </div>
                                <div>
                                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Day {dayIdx + 1}</p>
                                  <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-emerald-400" />
                                    <h2 className="text-xl font-bold text-white">{stop.city}</h2>
                                    {weatherMap[stop._id] && (
                                      <span className="flex items-center gap-1 text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full">
                                        {weatherMap[stop._id].temperature > 15 ? <Sun size={12} /> : <CloudRain size={12} />}
                                        {weatherMap[stop._id].temperature}°C
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleMagicFill(stop._id, stop.city)}
                                disabled={isGenerating === stop._id}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full font-bold text-xs hover:from-purple-500/30 hover:to-indigo-500/30 transition-all disabled:opacity-50"
                              >
                                {isGenerating === stop._id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                AI Magic Fill
                              </button>
                            </div>

                            {/* Activity vs Expense columns */}
                            <div className="p-5">
                              {acts.length > 0 ? (
                                <>
                                  {/* Column headers */}
                                  <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                                      <Clock size={12} /> Activity
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                                      <DollarSign size={12} /> Expense
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    {acts.map((act, actIdx) => (
                                      <motion.div
                                        key={act._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: actIdx * 0.05 }}
                                        className="grid grid-cols-2 gap-3 items-center"
                                      >
                                        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                                          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                                          <span className="text-sm text-white/80 font-medium truncate">{act.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-emerald-500/10 rounded-xl px-4 py-2.5 border border-emerald-500/20">
                                          <DollarSign size={14} className="text-emerald-400 flex-shrink-0" />
                                          <span className="text-sm text-emerald-400 font-bold">{act.cost || 0}</span>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                  {/* Total row */}
                                  <div className="flex justify-end mt-3 pt-3 border-t border-white/5">
                                    <span className="text-sm text-white/40 mr-3">Day Total:</span>
                                    <span className="text-emerald-400 font-bold">${totalCost}</span>
                                  </div>
                                </>
                              ) : (
                                <p className="text-white/20 text-sm text-center py-4">No activities yet</p>
                              )}
                              <button onClick={() => handleAddActivity(stop._id)}
                                className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                                <Plus size={16} /> Add Activity
                              </button>
                            </div>
                          </div>
                        </Reorder.Item>

                        {/* Connection arrow between stops */}
                        {dayIdx < stops.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ArrowDown size={20} className="text-white/15" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </Reorder.Group>

                {/* Add Stop */}
                <form onSubmit={handleAddStop} className="flex items-center gap-3 bg-white/5 border border-dashed border-white/15 rounded-3xl p-4 mt-4">
                  <MapPin size={20} className="text-white/20 flex-shrink-0" />
                  <input
                    required value={newCity} onChange={e => setNewCity(e.target.value)}
                    placeholder="Add next destination (e.g. Tokyo)"
                    className="flex-1 bg-transparent outline-none text-white placeholder-white/20 font-semibold"
                  />
                  <button type="submit" className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-400 transition-colors">
                    <Plus size={20} />
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'map'       && <MapView stops={stops} />}
            {activeTab === 'budget'    && <BudgetView tripId={id} />}
            {activeTab === 'checklist' && <ChecklistView tripId={id} />}
            {activeTab === 'notes'     && <NotesView tripId={id} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
