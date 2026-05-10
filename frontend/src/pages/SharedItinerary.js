import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Globe2, Clock } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { getStops, getActivities } from '../api/itineraryApi';

// Read-only public view for sharing with friends
export default function SharedItinerary() {
  const { id } = useParams();
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const fetchedStops = await getStops(id);
      setStops(fetchedStops);
      for (let stop of fetchedStops) {
        const acts = await getActivities(stop._id);
        setActivitiesMap(prev => ({ ...prev, [stop._id]: acts }));
      }
    } catch (err) {
      // Trip may require auth or not exist — show empty state gracefully
      console.warn('Could not load shared itinerary:', err?.response?.status);
    }
  };

  return (
    <div className="min-h-screen relative p-6 lg:p-12 z-10 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <Globe2 className="text-indigo-500" size={32} />
            <span className="text-2xl font-black tracking-tight">Traveloop</span>
          </div>
          <ThemeToggle />
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <span className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">Shared Itinerary</span>
          <h1 className="text-5xl font-extrabold mt-6 mb-4">A Journey Awaits</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Take a look at this beautifully curated travel plan.</p>
        </motion.div>

        <div className="relative border-l-4 border-indigo-500/30 ml-4 space-y-12 pb-12 mt-16">
          {stops.map((stop, index) => (
            <motion.div 
              key={stop._id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              <div className="absolute -left-3 top-0 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
              
              <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-indigo-500" size={28} />
                  <h2 className="text-3xl font-bold">{stop.city}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activitiesMap[stop._id] || []).map((act) => (
                    <div key={act._id} className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/30 shadow-sm flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">{act.title}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <Clock size={14} /> Anytime
                        </div>
                      </div>
                    </div>
                  ))}
                  {(activitiesMap[stop._id] || []).length === 0 && (
                    <p className="text-sm italic text-gray-500">No activities scheduled.</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {stops.length === 0 && (
            <p className="text-center text-gray-500 italic mt-8">Loading or empty itinerary.</p>
          )}
        </div>
      </div>
    </div>
  );
}
