import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { getChecklist, addChecklistItem, updateChecklistItem, deleteChecklistItem } from '../api/utilApi';

const CATEGORIES = [
  { id: 'documents',   label: 'Documents',   emoji: '📄', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  { id: 'clothing',    label: 'Clothing',    emoji: '👕', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'electronics', label: 'Electronics', emoji: '🔌', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'other',       label: 'Other',       emoji: '🎒', color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
];

export default function ChecklistView({ tripId }) {
  const [items, setItems] = useState([]);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('documents');
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    getChecklist(tripId).then(setItems).catch(console.error);
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const added = await addChecklistItem(tripId, { text: newText, category: newCategory });
    setItems([added, ...items]);
    setNewText('');
  };

  const togglePacked = async (item) => {
    const updated = await updateChecklistItem(item._id, { isPacked: !item.isPacked });
    setItems(items.map(i => i._id === item._id ? updated : i));
  };

  const handleDelete = async (id) => {
    await deleteChecklistItem(id);
    setItems(items.filter(i => i._id !== id));
  };

  const handleShare = () => {
    const text = items.map(i => `${i.isPacked ? '✅' : '⬜'} ${i.text}`).join('\n');
    navigator.clipboard?.writeText(text);
    alert('Checklist copied to clipboard!');
  };

  const packed = items.filter(i => i.isPacked).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header + Progress */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Packing Checklist</h2>
        <button onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-sm font-semibold hover:bg-emerald-500/30 transition-colors">
          <Share2 size={14} /> Share
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/50">{packed} of {total} items packed</span>
          <span className="text-emerald-400 font-bold">{progress}%</span>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          />
        </div>
      </div>

      {/* Add Item */}
      <form onSubmit={handleAdd} className="flex gap-3">
        <select
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
        >
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id} className="bg-gray-900">{c.emoji} {c.label}</option>
          ))}
        </select>
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Add item (e.g., Passport, Charger...)"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
        />
        <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 rounded-xl transition-colors">
          <Plus size={20} />
        </button>
      </form>

      {/* Nested Categories */}
      <div className="space-y-3">
        {CATEGORIES.map(cat => {
          const catItems = items.filter(i => (i.category || 'other') === cat.id);
          if (catItems.length === 0) return null;
          const catPacked = catItems.filter(i => i.isPacked).length;
          const isCollapsed = collapsed[cat.id];
          return (
            <div key={cat.id} className={`${cat.bg} border ${cat.border} rounded-2xl overflow-hidden`}>
              {/* Category header */}
              <button
                onClick={() => setCollapsed(p => ({ ...p, [cat.id]: !p[cat.id] }))}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span className={`font-bold text-sm ${cat.color}`}>{cat.label}</span>
                  <span className="text-xs text-white/30">{catPacked}/{catItems.length}</span>
                </div>
                {isCollapsed ? <ChevronDown size={16} className="text-white/30" /> : <ChevronUp size={16} className="text-white/30" />}
              </button>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 space-y-2">
                      {catItems.map(item => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            item.isPacked
                              ? 'bg-white/5 border-white/5 opacity-60'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => togglePacked(item)}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                              item.isPacked ? `bg-emerald-500 border-emerald-500` : 'border-white/30'
                            }`}>
                              {item.isPacked && <Check size={11} className="text-white" />}
                            </div>
                            <span className={`text-sm font-medium ${item.isPacked ? 'line-through text-white/30' : 'text-white/80'}`}>
                              {item.text}
                            </span>
                          </div>
                          <button onClick={() => handleDelete(item._id)} className="text-red-400/40 hover:text-red-400 transition-colors ml-2">
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="text-white/20 text-center py-8">Add items to start packing!</p>
        )}
      </div>
    </div>
  );
}
