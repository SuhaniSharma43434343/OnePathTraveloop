import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { getTrips } from '../api/tripApi';
import ThemeToggle from '../components/ThemeToggle';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTrips().then(setTrips).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen relative p-6 lg:p-12 z-10 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <ThemeToggle />
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Your Journeys</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Relive past adventures or prepare for upcoming ones.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-gray-500">No trips yet. Let's plan something exciting!</p>
            </div>
          ) : (
            trips.map((trip, i) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/trips/${trip._id}`)}
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-white/20"
              >
                {/* Fallback gradient if no cover photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end transition-opacity group-hover:from-black/90">
                  <h3 className="text-2xl font-bold text-white mb-2">{trip.title}</h3>
                  <div className="flex items-center gap-4 text-gray-200 text-sm font-medium">
                    <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(trip.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
