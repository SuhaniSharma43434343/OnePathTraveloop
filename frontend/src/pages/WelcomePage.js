import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar } from '../api/userApi';
import ThemeToggle from '../components/ThemeToggle';
import './styles/WelcomePage.css';

const ROLE_LABELS = { traveler: '🧳 Traveler', agent: '🗺️ Travel Agent', admin: '⚙️ Admin' };
const API_BASE = 'http://localhost:5000';

export default function WelcomePage() {
  const { user, token, loading, logout } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [avatarOverride, setAvatarOverride] = useState(null); // local preview after post-login upload

  const handleAvatarChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarOverride(URL.createObjectURL(file));
    setUploading(true);
    try {
      await uploadAvatar(token, file);
    } finally {
      setUploading(false);
    }
  };

  // Priority: local override > DB avatar (prefixed with API base) > null (show initials)
  const avatarSrc = avatarOverride
    ? avatarOverride
    : user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`)
    : null;

  const initials = user?.name
    ? user.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (loading) {
    return (
      <div className="welcome-page">
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
          <ThemeToggle />
        </div>
        <div className="welcome-card">
          <div className="loading-avatar-skeleton" />
          <div className="loading-line" style={{ width: 160 }} />
          <div className="loading-line" style={{ width: 220 }} />
          <div className="loading-line" style={{ width: 110 }} />
          <div className="loading-btn-skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-page">
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
        <ThemeToggle />
      </div>

      <div className="welcome-card">
        {/* Avatar — click to change */}
        <div className="animate-1 avatar-wrapper" onClick={() => fileRef.current.click()} title="Click to change photo">
          {avatarSrc
            ? <img src={avatarSrc} alt={user?.name} className="avatar-img" />
            : <div className="avatar-initials">{initials}</div>
          }
          <div className="avatar-overlay">
            {uploading ? <span className="spinner-dark" /> : '📷'}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </div>

        {/* Greeting */}
        <div className="animate-2 welcome-greeting-block">
          <h2 className="welcome-greeting">Welcome, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="welcome-subtext">Your account is ready. Let's get started.</p>
        </div>

        {/* User Details */}
        <div className="animate-3 user-details-card">
          <div className="detail-row">
            <span className="detail-icon">👤</span>
            <div>
              <p className="detail-label">Full Name</p>
              <p className="detail-value">{user?.name}</p>
            </div>
          </div>
          <div className="detail-divider" />
          <div className="detail-row">
            <span className="detail-icon">✉️</span>
            <div>
              <p className="detail-label">Email</p>
              <p className="detail-value">{user?.email}</p>
            </div>
          </div>
          <div className="detail-divider" />
          <div className="detail-row">
            <span className="detail-icon">🏷️</span>
            <div>
              <p className="detail-label">Role</p>
              <p className="detail-value">{ROLE_LABELS[user?.role] || user?.role}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="animate-4 welcome-actions">
          <button
            className="btn-forward"
            disabled={loading || !user}
            onClick={() => navigate('/dashboard')}
          >
            Continue to Dashboard
            <span className="btn-arrow">→</span>
          </button>
          <button className="btn-logout" onClick={() => { logout(); navigate('/'); }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
