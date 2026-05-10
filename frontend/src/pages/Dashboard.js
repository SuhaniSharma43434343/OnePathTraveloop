import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Plane, Map, Plus, Compass, User, ShieldCheck } from 'lucide-react';
import Globe from '../components/Globe';
import CreateTripModal from '../components/CreateTripModal';
import { getTrips } from '../api/tripApi';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getTrips().then(setTrips).catch(console.error);
  }, []);

  const handleTripCreated = (newTrip) => {
    setTrips([newTrip, ...trips]);
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col">
      {/* Top Navigation */}
      <header className="w-full flex items-center justify-between p-6 z-50">
        <div className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          <Plane size={32} className="text-indigo-500" />
          Traveloop
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin')} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-colors">
            <ShieldCheck size={24} />
          </button>
          <button onClick={() => navigate('/profile')} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-colors">
            <User size={24} />
          </button>
          <ThemeToggle />
          <div className="flex items-center gap-3 backdrop-blur-md bg-white/10 dark:bg-black/20 px-4 py-2 rounded-full border border-white/20">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</span>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="text-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 z-10">
        
        {/* Left Column: Greeting & Actions */}
        <div className="flex flex-col justify-center gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-4">
              Explore the <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                Unknown
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Welcome back, {user?.name?.split(' ')[0]}. Where is your next adventure?
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex gap-4"
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105"
            >
              <Plus size={24} />
              Plan New Trip
            </button>
            <button 
              onClick={() => navigate('/my-trips')}
              className="flex items-center gap-2 backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 text-gray-800 dark:text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/30 transition-all"
            >
              <Map size={24} />
              My Trips
            </button>
          </motion.div>

          {/* Recent Trips Glass Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 p-6 rounded-3xl backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Compass className="text-indigo-500" /> Recent Trips
              </h3>
              <button className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline">View All</button>
            </div>
            
            <div className="space-y-3">
              {trips.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 p-4 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                  You have no upcoming trips. Time to explore!
                </p>
              ) : (
                trips.slice(0, 3).map(trip => (
                  <div key={trip._id} onClick={() => navigate(`/trips/${trip._id}`)} className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-2xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{trip.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">View</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: 3D Globe */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[600px] w-full hidden lg:block"
        >
          <Canvas camera={{ position: [0, 0, 6] }} style={{ pointerEvents: 'auto' }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <Globe />
          </Canvas>
          {/* Overlay hints */}
          <div className="absolute bottom-10 right-10 backdrop-blur-md bg-white/20 dark:bg-black/40 border border-white/20 p-4 rounded-2xl shadow-lg">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Interactive Globe</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Drag to spin and explore</p>
          </div>
        </motion.div>

      </main>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTripCreated={handleTripCreated} 
      />
    </div>
  );
}
