import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Plus, Clock, DollarSign } from 'lucide-react';
import { getStops, createStop, getActivities, createActivity } from '../api/itineraryApi';
import ThemeToggle from '../components/ThemeToggle';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({}); // stopId -> activities[]
  const [newCity, setNewCity] = useState('');

  useEffect(() => {
    loadStops();
  }, [id]);

  const loadStops = async () => {
    const fetchedStops = await getStops(id);
    setStops(fetchedStops);
    fetchedStops.forEach(loadActivities);
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
    setActivitiesMap(prev => ({
      ...prev,
      [stopId]: [...(prev[stopId] || []), act]
    }));
  };

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
          <ThemeToggle />
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Itinerary Builder</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Design your perfect journey, day by day.</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative border-l-4 border-indigo-500/30 ml-4 space-y-12 pb-12">
          {stops.map((stop, index) => (
            <motion.div 
              key={stop._id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-3 top-0 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
              
              <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-indigo-500" size={28} />
                  <h2 className="text-3xl font-bold">{stop.city}</h2>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {(activitiesMap[stop._id] || []).map((act, i) => (
                    <motion.div 
                      key={act._id}
                      whileHover={{ scale: 1.02, rotateY: 5 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-white/60 to-white/20 dark:from-gray-800/60 dark:to-gray-900/20 border border-white/30 shadow-md flex justify-between items-center transform transition-transform perspective-1000"
                    >
                      <div>
                        <h4 className="font-bold">{act.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <span className="flex items-center gap-1"><Clock size={14} /> Anytime</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                        ${act.cost || 0}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={() => handleAddActivity(stop._id)}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
                >
                  <Plus size={16} /> Add Activity
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add Stop Form */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pl-8">
            <div className="absolute -left-3 top-4 w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-900" />
            <form onSubmit={handleAddStop} className="flex items-center gap-4 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl">
              <input 
                required
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                placeholder="Where to next? (e.g. Tokyo)"
                className="flex-1 bg-transparent border-none outline-none text-lg font-bold placeholder-gray-500 dark:placeholder-gray-400 px-4"
              />
              <button type="submit" className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-colors">
                <Plus size={24} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
