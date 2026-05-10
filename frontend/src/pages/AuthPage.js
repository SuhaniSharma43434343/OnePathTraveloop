import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';
import LottieOverlay from '../components/LottieOverlay';
import useLottieTransition from '../components/useLottieTransition';
import useLottieData from '../components/useLottieData';

const EMPTY = { firstName: '', lastName: '', email: '', password: '', role: 'traveler', bio: '' };
const EMPTY_ERR = { firstName: '', lastName: '', email: '', password: '', form: '' };

function validate(field, value) {
  if (field === 'firstName' && !value.trim()) return 'First name is required';
  if (field === 'lastName'  && !value.trim()) return 'Last name is required';
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

const inputCls = (err) =>
  `w-full bg-white/[0.04] border rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500/40 transition-all text-sm font-light ${
    err ? 'border-red-500/50' : 'border-white/[0.08]'
  }`;

export default function AuthPage() {
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState(EMPTY_ERR);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef();
  const { login } = useAuth();
  const navigate  = useNavigate();
  const { showOverlay, run, handleDone } = useLottieTransition();
  const travelLoadingData = useLottieData('/lottie/travel-loading.json');

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

    let authError = null;
    let authData  = null;

    run(
      async () => {
        try {
          const fullName = mode === 'register' ? `${form.firstName} ${form.lastName}`.trim() : '';
          authData = mode === 'login'
            ? await loginUser({ email: form.email, password: form.password })
            : await registerUser({ name: fullName, email: form.email, password: form.password, role: form.role, avatarFile });
        } catch (err) {
          authError = err;
        } finally {
          setLoading(false);
        }
      },
      () => {
        if (authError) {
          setErrors(p => ({ ...p, form: authError.response?.data?.message || 'Server error. Please try again.' }));
        } else if (authData) {
          login(authData.token, authData.user);
          navigate('/welcome');
        }
      }
    );
  };

  const initials = form.firstName
    ? (form.firstName[0] + (form.lastName?.[0] || '')).toUpperCase()
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      {travelLoadingData && (
        <LottieOverlay
          animationData={travelLoadingData}
          show={showOverlay}
          onDone={handleDone}
          minDuration={1500}
          skipThreshold={300}
          loop
          label="Signing you in"
        />
      )}
      <div className="absolute top-6 right-6 z-50"><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.25 }}
        className="glass-panel-strong w-full max-w-md p-8 relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-glow"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,78,59,0.3))', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <Plane size={28} className="text-emerald-400" />
          </motion.div>
          <h1 className="heading-lg text-2xl mb-1">Traveloop</h1>
          <p className="text-slate-500 text-sm font-light tracking-wide">
            {mode === 'login' ? 'Welcome back, explorer' : 'Begin your journey'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 mb-7 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === m
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={mode === m ? { background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.35)' } : {}}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div
                key="reg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div
                    onClick={() => fileRef.current.click()}
                    className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer overflow-hidden relative group flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#064e3b,#065f46)', border: '2px solid rgba(16,185,129,0.4)', boxShadow: '0 0 16px rgba(16,185,129,0.2)' }}
                  >
                    {avatarPreview
                      ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                      : <span className="text-emerald-400 font-bold text-lg">{initials || '+'}</span>
                    }
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-base">✏️</div>
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium text-sm">Profile Photo</p>
                    <p className="text-slate-500 text-xs mb-2 font-light">Optional · JPG, PNG up to 2MB</p>
                    <button type="button" onClick={() => fileRef.current.click()}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                      {avatarPreview ? 'Change photo' : 'Upload photo'}
                    </button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
                </div>

                {/* Name grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handle} onBlur={handleBlur} className={inputCls(errors.firstName)} />
                    {errors.firstName && <p className="text-red-400/80 text-xs mt-1 font-light">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handle} onBlur={handleBlur} className={inputCls(errors.lastName)} />
                    {errors.lastName && <p className="text-red-400/80 text-xs mt-1 font-light">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Role */}
                <select name="role" value={form.role} onChange={handle}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-slate-300 outline-none focus:ring-1 focus:ring-emerald-500/60 text-sm font-light">
                  <option value="traveler" className="bg-slate-900">🧳 Traveler</option>
                  <option value="agent"    className="bg-slate-900">🗺️ Travel Agent</option>
                  <option value="admin"    className="bg-slate-900">⚙️ Admin</option>
                </select>

                {/* Bio */}
                <textarea name="bio" placeholder="Your travel style... (optional)" value={form.bio} onChange={handle} rows={2}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-slate-300 placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500/60 text-sm font-light resize-none" />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handle} onBlur={handleBlur} className={inputCls(errors.email)} />
            {errors.email && <p className="text-red-400/80 text-xs mt-1 font-light">{errors.email}</p>}
          </div>

          <div>
            <input name="password" type="password" placeholder={mode === 'register' ? 'Password (min. 8 characters)' : 'Password'} value={form.password} onChange={handle} onBlur={handleBlur} className={inputCls(errors.password)} />
            {errors.password && <p className="text-red-400/80 text-xs mt-1 font-light">{errors.password}</p>}
          </div>

          {errors.form && (
            <div className="rounded-2xl px-4 py-3 text-red-400 text-sm font-light" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {errors.form}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(16,185,129,0.5)' }}
            whileTap={{ scale: 0.97 }}
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex justify-center items-center gap-2 mt-2 transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' }}
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
