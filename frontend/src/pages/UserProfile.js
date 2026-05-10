import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Badges3D from '../components/Badges3D';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved! (Hackathon Mock)");
  };

  return (
    <div className="min-h-screen relative p-6 lg:p-12 z-10 text-gray-900 dark:text-white flex justify-center items-center">
      <div className="max-w-2xl w-full">
        <header className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <ThemeToggle />
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage your account details and preferences.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3 text-gray-400" size={20} />
                <input 
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white/50 dark:bg-gray-800/50 border border-white/30 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 text-gray-400" size={20} />
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} disabled
                  className="w-full bg-gray-100/50 dark:bg-gray-800/30 border border-white/30 rounded-xl py-3 pl-12 pr-4 outline-none text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
              <button 
                type="button" onClick={() => { logout(); navigate('/'); }}
                className="text-red-500 font-bold hover:underline"
              >
                Sign Out
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all"
              >
                <Save size={20} /> Save Changes
              </button>
            </div>
          </form>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Travel Achievements</h2>
            <Badges3D />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
