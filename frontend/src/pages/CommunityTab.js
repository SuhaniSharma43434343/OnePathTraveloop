import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Heart, MessageCircle, Share2, Bookmark, MapPin, Users } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const GROUPS = ['All', 'Beach', 'Mountains', 'City', 'Adventure', 'Culture'];

const FEED = [
  {
    id: 1, user: 'Suhani Mehta', avatar: 'SM', role: 'Admin',
    location: 'Bali, Indonesia', time: '2h ago',
    content: 'Just finished a sunrise trek to Mount Batur 🌋 The view from the top was absolutely breathtaking. Highly recommend waking up at 2am for this one!',
    tags: ['Adventure', 'Mountains'], likes: 142, comments: 28, color: 'from-orange-500 to-red-500',
  },
  {
    id: 2, user: 'Riya Sharma', avatar: 'RS', role: 'Traveler',
    location: 'Santorini, Greece', time: '5h ago',
    content: 'Blue domes, white walls, and the most stunning sunset I\'ve ever seen 🌅 Santorini is everything they say it is and more. The local wine is incredible too!',
    tags: ['Beach', 'Culture'], likes: 89, comments: 14, color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3, user: 'Priya Kapoor', avatar: 'PK', role: 'Agent',
    location: 'Kyoto, Japan', time: '1d ago',
    content: 'Cherry blossom season in Kyoto is pure magic 🌸 Walked through Maruyama Park at dusk — the illuminated trees reflecting on the pond is something I\'ll never forget.',
    tags: ['Culture', 'City'], likes: 203, comments: 41, color: 'from-pink-500 to-rose-500',
  },
  {
    id: 4, user: 'Arjun Nair', avatar: 'AN', role: 'Traveler',
    location: 'Manali, India', time: '2d ago',
    content: 'First time skiing in Solang Valley ❄️ Fell about 20 times but absolutely loved every second. The Himalayas as a backdrop make everything better.',
    tags: ['Mountains', 'Adventure'], likes: 67, comments: 19, color: 'from-indigo-500 to-purple-500',
  },
];

export default function CommunityTab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});

  const filtered = FEED.filter(post => {
    const matchSearch = post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.location.toLowerCase().includes(search.toLowerCase()) ||
      post.user.toLowerCase().includes(search.toLowerCase());
    const matchGroup = activeGroup === 'All' || post.tags.includes(activeGroup);
    return matchSearch && matchGroup;
  });

  return (
    <div className="min-h-screen relative p-6 lg:p-10 z-10 text-white">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <ArrowLeft size={18} /> Dashboard
          </button>
          <ThemeToggle />
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-4xl font-extrabold mb-1 flex items-center gap-3">
            <Users size={32} className="text-emerald-400" /> Community
          </h1>
          <p className="text-white/40">Discover experiences from fellow travelers</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search experiences, places, people..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        {/* Group-by chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-8">
          {GROUPS.map(g => (
            <button key={g} onClick={() => setActiveGroup(g)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeGroup === g
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
              }`}>
              {g}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-5">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all"
            >
              {/* User header */}
              <div className="flex items-center gap-3 p-5 pb-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg`}>
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{post.user}</span>
                    <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{post.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-xs mt-0.5">
                    <MapPin size={11} /> {post.location}
                    <span>·</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-5 pb-4">
                <p className="text-white/80 leading-relaxed">{post.content}</p>
                <div className="flex gap-2 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-5 py-3 border-t border-white/5">
                <button
                  onClick={() => setLiked(p => ({ ...p, [post.id]: !p[post.id] }))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    liked[post.id] ? 'text-red-400 bg-red-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Heart size={16} fill={liked[post.id] ? 'currentColor' : 'none'} />
                  {post.likes + (liked[post.id] ? 1 : 0)}
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all">
                  <MessageCircle size={16} /> {post.comments}
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all">
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => setSaved(p => ({ ...p, [post.id]: !p[post.id] }))}
                  className={`ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    saved[post.id] ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Bookmark size={16} fill={saved[post.id] ? 'currentColor' : 'none'} />
                </button>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-white/40">No posts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
