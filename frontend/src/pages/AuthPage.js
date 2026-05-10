import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Camera } from 'lucide-react';
import './styles/AuthPage.css';

const EMPTY_FIELDS = { name: '', email: '', password: '', role: 'traveler' };
const EMPTY_ERRORS = { name: '', email: '', password: '', form: '' };

function validate(field, value) {
  if (field === 'name' && !value.trim()) return 'Full name is required';
  if (field === 'email') {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
  }
  if (field === 'password') {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
  }
  return '';
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(EMPTY_FIELDS);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const switchMode = (m) => {
    setMode(m);
    setForm(EMPTY_FIELDS);
    setErrors(EMPTY_ERRORS);
    setTouched({});
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Clear field error on change only if already touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = e => {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validateAll = () => {
    const fields = mode === 'register' ? ['name', 'email', 'password'] : ['email', 'password'];
    const newErrors = { ...EMPTY_ERRORS };
    let valid = true;
    fields.forEach(f => {
      const msg = validate(f, form[f]);
      if (msg) { newErrors[f] = msg; valid = false; }
    });
    setErrors(newErrors);
    setTouched(fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
    return valid;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validateAll()) return;
    setErrors(prev => ({ ...prev, form: '' }));
    setLoading(true);
    try {
      const data = mode === 'login'
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({ ...form, avatarFile });
      login(data.token, data.user);
      navigate('/welcome');
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.response?.data?.message || 'Server error. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  const initials = form.name
    ? form.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-transparent p-4">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="w-full max-w-md p-8 rounded-[2rem] backdrop-blur-2xl bg-white/40 dark:bg-black/40 border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] relative z-10"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="p-4 bg-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400"
          >
            <Plane size={32} />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Traveloop</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 font-medium">
          {mode === 'login' ? 'Welcome back' : 'Create your journey'}
        </p>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Register</button>
        </div>

        <form onSubmit={submit} className="auth-form" noValidate>
          {mode === 'register' && (
            <>
              {/* Avatar upload */}
              <div className="avatar-upload-row">
                <div className="avatar-upload-preview" onClick={() => fileRef.current.click()}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="preview" />
                    : initials
                    ? <span className="avatar-initials-sm">{initials}</span>
                    : <span className="avatar-placeholder-icon">📷</span>
                  }
                  <div className="avatar-upload-overlay">
                    {avatarPreview ? '✏️' : '📷'}
                  </div>
                </div>
                <div className="avatar-upload-info">
                  <p className="avatar-upload-label">Profile Photo</p>
                  <p className="avatar-upload-hint">Optional · JPG, PNG up to 2MB</p>
                  <button type="button" className="avatar-upload-btn" onClick={() => fileRef.current.click()}>
                    {avatarPreview ? 'Change photo' : 'Upload photo'}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              </div>

              <div className="field-group">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handle}
                  onBlur={handleBlur}
                  className={errors.name ? 'input-error' : ''}
                  autoComplete="name"
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="field-group">
                <select name="role" value={form.role} onChange={handle}>
                  <option value="traveler">🧳 Traveler</option>
                  <option value="agent">🗺️ Travel Agent</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="field-group">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handle}
              onBlur={handleBlur}
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="field-group">
            <input
              name="password"
              type="password"
              placeholder={mode === 'register' ? 'Password (min. 8 characters)' : 'Password'}
              value={form.password}
              onChange={handle}
              onBlur={handleBlur}
              className={errors.password ? 'input-error' : ''}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          {errors.form && <p className="form-error">{errors.form}</p>}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2 mt-4"
            disabled={loading}
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
