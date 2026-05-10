import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Map, Activity, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Users', value: '1,204', icon: <Users size={24} />, color: 'bg-blue-500' },
    { label: 'Active Trips', value: '458', icon: <Map size={24} />, color: 'bg-indigo-500' },
    { label: 'Activities Logged', value: '3,892', icon: <Activity size={24} />, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen relative p-6 lg:p-12 z-10 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <ThemeToggle />
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex items-center gap-4">
          <ShieldCheck size={40} className="text-indigo-500" />
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Admin Dashboard</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">System Overview & Analytics</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl flex items-center gap-6"
            >
              <div className={`w-16 h-16 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Recent System Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex justify-between items-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/10">
                <div>
                  <p className="font-bold">New Trip Created</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">User ID: 5f8d...9a2b planned a trip to Tokyo</p>
                </div>
                <span className="text-sm text-gray-500">2 mins ago</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
