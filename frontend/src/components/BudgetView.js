import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { getStops, getActivities } from '../api/itineraryApi';

export default function BudgetView({ tripId }) {
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadData();
  }, [tripId]);

  const loadData = async () => {
    const fetchedStops = await getStops(tripId);
    setStops(fetchedStops);
    
    let allActs = [];
    for (let stop of fetchedStops) {
      const acts = await getActivities(stop._id);
      allActs = [...allActs, ...acts.map(a => ({...a, stopCity: stop.city}))];
    }
    setActivities(allActs);
  };

  const totalCost = useMemo(() => {
    return activities.reduce((sum, act) => sum + (act.cost || 0), 0);
  }, [activities]);

  const maxCost = useMemo(() => {
    return Math.max(...activities.map(a => a.cost || 0), 100); // minimum 100 for scale
  }, [activities]);

  return (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Breakdown</h2>
          <p className="text-gray-600 dark:text-gray-400">Total estimated activity cost</p>
        </div>
        <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
          ${totalCost}
        </div>
      </div>

      <div className="space-y-6">
        {activities.map((act, i) => {
          const widthPercent = ((act.cost || 0) / maxCost) * 100;
          return (
            <div key={act._id}>
              <div className="flex justify-between mb-2 text-sm font-semibold">
                <span className="text-gray-800 dark:text-gray-200">{act.title} <span className="text-gray-500 font-normal">({act.stopCity})</span></span>
                <span className="text-indigo-600 dark:text-indigo-400">${act.cost || 0}</span>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
            </div>
          );
        })}
        {activities.length === 0 && (
          <p className="text-gray-500 italic">No activities added yet to calculate budget.</p>
        )}
      </div>
    </div>
  );
}
