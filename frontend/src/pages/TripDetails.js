import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ArrowLeft, MapPin, Plus, Clock, Wallet, CheckSquare, FileText, Map as MapIcon, Sparkles, Loader2, GripVertical, CloudRain, Sun, Download, Map as Map2 } from 'lucide-react';
import { getStops, createStop, getActivities, createActivity } from '../api/itineraryApi';
import ThemeToggle from '../components/ThemeToggle';
import BudgetView from '../components/BudgetView';
import ChecklistView from '../components/ChecklistView';
import NotesView from '../components/NotesView';
import MapView from '../components/MapView';
export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [weatherMap, setWeatherMap] = useState({});
  const [newCity, setNewCity] = useState('');
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isGenerating, setIsGenerating] = useState(null); 

  useEffect(() => {
    loadStops();
  }, [id]);

  const loadStops = async () => {
    const fetchedStops = await getStops(id);
    setStops(fetchedStops);
    fetchedStops.forEach(loadActivities);
    fetchedStops.forEach(loadWeather);
  };

  // Basic mock lat/lng map for weather since we don't have a real geocoder
  const mockCoordinates = {
    'Tokyo': { lat: 35.68, lng: 139.65 },
    'Kyoto': { lat: 35.01, lng: 135.76 },
    'Osaka': { lat: 34.69, lng: 135.50 },
    'Paris': { lat: 48.85, lng: 2.35 },
    'London': { lat: 51.50, lng: -0.12 },
    'New York': { lat: 40.71, lng: -74.00 }
  };

  const loadWeather = async (stop) => {
    try {
      const coords = mockCoordinates[stop.city];
      if (!coords) return; // Skip if we don't have mock coords
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true`);
      const data = await res.json();
      setWeatherMap(prev => ({ ...prev, [stop._id]: data.current_weather }));
    } catch (err) {
      console.error("Weather fetch failed", err);
    }
  };

  const loadActivities = async (stop) => {
    const acts = await getActivities(stop._id);
    setActivitiesMap(prev => ({ ...prev, [stop._id]: acts }));
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    const newStop = await createStop({ trip: id, city: newCity, order: stops.length });
    setStops([...stops, newStop]);
    setNewCity('');
  };

  const handleAddActivity = async (stopId) => {
    const title = prompt("Enter Activity Title (e.g., Visit Museum):");
    if (!title) return;
    const cost = prompt("Estimated Cost ($):", "0");
    const act = await createActivity({ stop: stopId, title, cost: Number(cost) });
    setActivitiesMap(prev => ({ ...prev, [stopId]: [...(prev[stopId] || []), act] }));
  };

  const handleMagicFill = async (stopId, cityName) => {
    setIsGenerating(stopId);
    
    // Simulate AI API Call delay
    await new Promise(r => setTimeout(r, 1500));
    
    const mockActivities = [
      { title: `Explore Downtown ${cityName}`, cost: 0 },
      { title: 'Local Cuisine Tasting', cost: 45 },
      { title: 'Guided Historic Walking Tour', cost: 25 },
    ];
    
    let addedActs = [];
    for (let act of mockActivities) {
      const added = await createActivity({ stop: stopId, ...act });
      addedActs.push(added);
    }
    
    setActivitiesMap(prev => ({
      ...prev,
      [stopId]: [...(prev[stopId] || []), ...addedActs]
    }));
    setIsGenerating(null);
  };

  const handleReorder = (newOrder) => {
    setStops(newOrder);
  };

  const exportPDF = async () => {
    const element = document.getElementById('itinerary-export-area');
    if (!element) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin:      10,
      filename:    'Traveloop_Itinerary.pdf',
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  };

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: <MapIcon size={18} /> },
    { id: 'map', label: 'Route Map', icon: <Map2 size={18} /> },
    { id: 'budget', label: 'Budget', icon: <Wallet size={18} /> },
    { id: 'checklist', label: 'Checklist', icon: <CheckSquare size={18} /> },
    { id: 'notes', label: 'Notes', icon: <FileText size={18} /> }
  ];

  return (
    <div className="min-h-screen relative p-6 lg:p-12 z-10 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/my-trips')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Trips
          </button>
          <div className="flex gap-4">
            <button 
              onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <Download size={18} /> Export PDF
            </button>
            <ThemeToggle />
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Trip Command Center</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Manage every aspect of your journey.</p>
        </motion.div>

        {/* Custom Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-white/20 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-gray-700/60'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'itinerary' && (
              <div id="itinerary-export-area">
              <Reorder.Group axis="y" values={stops} onReorder={handleReorder} className="relative border-l-4 border-indigo-500/30 ml-4 space-y-12 pb-12">
                {stops.map((stop) => (
                  <Reorder.Item key={stop._id} value={stop} className="relative pl-8 cursor-grab active:cursor-grabbing">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
                    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <GripVertical className="text-gray-400 hover:text-gray-600 cursor-grab" size={24} />
                          <MapPin className="text-indigo-500" size={28} />
                          <h2 className="text-3xl font-bold">{stop.city}</h2>
                          {weatherMap[stop._id] && (
                            <div className="flex items-center gap-1 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full ml-2">
                              {weatherMap[stop._id].temperature > 15 ? <Sun size={14} /> : <CloudRain size={14} />}
                              {weatherMap[stop._id].temperature}°C
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => handleMagicFill(stop._id, stop.city)}
                          disabled={isGenerating === stop._id}
                          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                        >
                          {isGenerating === stop._id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          AI Magic Fill
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {(activitiesMap[stop._id] || []).map((act) => (
                          <div key={act._id} className="p-4 rounded-2xl bg-gradient-to-br from-white/60 to-white/20 dark:from-gray-800/60 dark:to-gray-900/20 border border-white/30 shadow-md flex justify-between items-center hover:scale-[1.02] transition-transform">
                            <div>
                              <h4 className="font-bold">{act.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span className="flex items-center gap-1"><Clock size={14} /> Anytime</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-center min-w-[3rem] h-12 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2">
                              ${act.cost || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => handleAddActivity(stop._id)} className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors">
                        <Plus size={16} /> Add Activity
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
                <div className="relative pl-8">
                  <div className="absolute -left-3 top-4 w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-900" />
                  <form onSubmit={handleAddStop} className="flex items-center gap-4 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl">
                    <input 
                      required value={newCity} onChange={e => setNewCity(e.target.value)}
                      placeholder="Where to next? (e.g. Tokyo)"
                      className="flex-1 bg-transparent border-none outline-none text-lg font-bold placeholder-gray-500 px-4"
                    />
                    <button type="submit" className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-colors">
                      <Plus size={24} />
                    </button>
                  </form>
                </div>
              </Reorder.Group>
              </div>
            )}

            {activeTab === 'map' && <MapView stops={stops} />}
            {activeTab === 'budget' && <BudgetView tripId={id} />}
            {activeTab === 'checklist' && <ChecklistView tripId={id} />}
            {activeTab === 'notes' && <NotesView tripId={id} />}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
