import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';
import './styles/AuthPage.css';

const EMPTY = { firstName: '', lastName: '', email: '', password: '', role: 'traveler', bio: '' };
const EMPTY_ERR = { firstName: '', lastName: '', email: '', password: '', form: '' };

function validate(field, value) {
  if (field === 'firstName' && !value.trim()) return 'First name is required';
  if (field === 'lastName' && !value.trim()) return 'Last name is required';
  if (field === 'email') {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email';
  }
  if (field === 'password') {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Minimum 8 characters';
  }
  return '';
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState(EMPTY_ERR);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const switchMode = (m) => {
    setMode(m); setForm(EMPTY); setErrors(EMPTY_ERR);
    setTouched({}); setAvatarFile(null); setAvatarPreview(null);
  };

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = e => {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const handleAvatar = e => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validateAll = () => {
    const fields = mode === 'register'
      ? ['firstName', 'lastName', 'email', 'password']
      : ['email', 'password'];
    const newErr = { ...EMPTY_ERR };
    let valid = true;
    fields.forEach(f => {
      const msg = validate(f, form[f]);
      if (msg) { newErr[f] = msg; valid = false; }
    });
    setErrors(newErr);
    setTouched(fields.reduce((a, f) => ({ ...a, [f]: true }), {}));
    return valid;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validateAll()) return;
    setErrors(p => ({ ...p, form: '' }));
    setLoading(true);
    try {
      const fullName = mode === 'register' ? `${form.firstName} ${form.lastName}`.trim() : '';
      const data = mode === 'login'
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({ name: fullName, email: form.email, password: form.password, role: form.role, avatarFile });
      login(data.token, data.user);
      navigate('/welcome');
    } catch (err) {
      setErrors(p => ({ ...p, form: err.response?.data?.message || 'Server error. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  const initials = form.firstName ? (form.firstName[0] + (form.lastName?.[0] || '')).toUpperCase() : null;

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-transparent p-4">
      <div className="absolute top-6 right-6 z-50"><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        className="w-full max-w-lg p-8 rounded-[2rem] backdrop-blur-2xl bg-white/10 dark:bg-black/30 border border-white/20 shadow-2xl relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="p-4 bg-emerald-500/20 rounded-full text-emerald-400 mb-3"
          >
            <Plane size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Traveloop
          </h1>
          <p className="text-white/60 dark:text-white/50 text-sm mt-1">
            {mode === 'login' ? 'Welcome back, explorer' : 'Begin your journey'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-2xl p-1 mb-6 border border-white/10">
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize ${
                mode === m
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Avatar Upload */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div
                    onClick={() => fileRef.current.click()}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center cursor-pointer overflow-hidden relative group flex-shrink-0 shadow-lg"
                  >
                    {avatarPreview
                      ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                      : <span className="text-white font-bold text-xl">{initials || '📷'}</span>
                    }
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg">✏️</div>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Profile Photo</p>
                    <p className="text-white/40 text-xs mb-2">Optional · JPG, PNG up to 2MB</p>
                    <button type="button" onClick={() => fileRef.current.click()}
                      className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      {avatarPreview ? 'Change photo' : 'Upload photo'}
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
                </div>

                {/* Dual-column name grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      name="firstName" placeholder="First Name"
                      value={form.firstName} onChange={handle} onBlur={handleBlur}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm ${errors.firstName ? 'border-red-500/60' : 'border-white/10'}`}
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input
                      name="lastName" placeholder="Last Name"
                      value={form.lastName} onChange={handle} onBlur={handleBlur}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm ${errors.lastName ? 'border-red-500/60' : 'border-white/10'}`}
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Role */}
                <select
                  name="role" value={form.role} onChange={handle}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                >
                  <option value="traveler" className="bg-gray-900">🧳 Traveler</option>
                  <option value="agent" className="bg-gray-900">🗺️ Travel Agent</option>
                  <option value="admin" className="bg-gray-900">⚙️ Admin</option>
                </select>

                {/* Bio textarea */}
                <textarea
                  name="bio" placeholder="Tell us about your travel style... (optional)"
                  value={form.bio} onChange={handle} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <input
              name="email" type="email" placeholder="Email address"
              value={form.email} onChange={handle} onBlur={handleBlur}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm ${errors.email ? 'border-red-500/60' : 'border-white/10'}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              name="password" type="password"
              placeholder={mode === 'register' ? 'Password (min. 8 characters)' : 'Password'}
              value={form.password} onChange={handle} onBlur={handleBlur}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm ${errors.password ? 'border-red-500/60' : 'border-white/10'}`}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {errors.form && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {errors.form}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex justify-center items-center gap-2 mt-2"
          >
            {loading
              ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
