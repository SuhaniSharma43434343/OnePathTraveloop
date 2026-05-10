import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2 } from 'lucide-react';
import { getChecklist, addChecklistItem, updateChecklistItem, deleteChecklistItem } from '../api/utilApi';

export default function ChecklistView({ tripId }) {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    getChecklist(tripId).then(setItems).catch(console.error);
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const added = await addChecklistItem(tripId, { text: newItemText });
    setItems([added, ...items]);
    setNewItemText('');
  };

  const togglePacked = async (item) => {
    const updated = await updateChecklistItem(item._id, { isPacked: !item.isPacked });
    setItems(items.map(i => i._id === item._id ? updated : i));
  };

  const handleDelete = async (id) => {
    await deleteChecklistItem(id);
    setItems(items.filter(i => i._id !== id));
  };

  return (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Packing Checklist</h2>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-8">
        <input 
          value={newItemText}
          onChange={e => setNewItemText(e.target.value)}
          placeholder="e.g., Passport, Sunscreen..."
          className="flex-1 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-bold transition-colors">
          <Plus />
        </button>
      </form>

      <div className="space-y-3">
        {items.map(item => (
          <motion.div 
            key={item._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              item.isPacked 
                ? 'bg-green-500/10 border-green-500/30 text-gray-500 line-through' 
                : 'bg-white/60 dark:bg-gray-800/60 border-white/30 text-gray-900 dark:text-white'
            }`}
          >
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => togglePacked(item)}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                item.isPacked ? 'bg-green-500 border-green-500' : 'border-gray-400'
              }`}>
                {item.isPacked && <Check size={14} className="text-white" />}
              </div>
              <span className="font-medium text-lg">{item.text}</span>
            </div>
            <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
