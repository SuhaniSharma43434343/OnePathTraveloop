import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
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
    <div className="auth-page">
      <ThemeToggle />
      <div className="auth-card animate-1">
        <div className="auth-logo">✈️</div>
        <h1 className="auth-title">OnePathTravel</h1>
        <p className="auth-subtitle">{mode === 'login' ? 'Welcome back' : 'Create your account'}</p>

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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? <><span className="spinner" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>
      </div>
    </div>
  );
}
