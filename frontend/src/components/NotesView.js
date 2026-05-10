import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { getNotes, addNote, deleteNote } from '../api/utilApi';

export default function NotesView({ tripId }) {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    getNotes(tripId).then(setNotes).catch(console.error);
  }, [tripId]);

  const handleAdd = async () => {
    if (!newNoteText.trim()) return;
    const added = await addNote(tripId, { text: newNoteText });
    setNotes([added, ...notes]);
    setNewNoteText('');
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes(notes.filter(n => n._id !== id));
  };

  return (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trip Notes</h2>
      
      <div className="mb-8">
        <textarea 
          value={newNoteText}
          onChange={e => setNewNoteText(e.target.value)}
          placeholder="Jot down ideas, reservation numbers, or thoughts..."
          className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
        />
        <button 
          onClick={handleAdd}
          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Save Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map(note => (
          <motion.div 
            key={note._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-yellow-100/80 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 shadow-md relative group"
          >
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{note.text}</p>
            <button 
              onClick={() => handleDelete(note._id)} 
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            <div className="mt-4 text-xs text-gray-500">
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
