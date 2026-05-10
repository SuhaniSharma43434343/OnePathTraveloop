import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import './styles/Dashboard.css';

const FEATURES = [
  { icon: '🗺️', title: 'Explore Destinations', desc: 'Discover top travel spots worldwide' },
  { icon: '✈️', title: 'Book Flights', desc: 'Find and book the best flight deals' },
  { icon: '🏨', title: 'Hotels', desc: 'Browse curated hotel recommendations' },
  { icon: '📋', title: 'My Trips', desc: 'Manage your upcoming and past trips' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <ThemeToggle />
      <header className="dash-header animate-1">
        <div className="dash-brand">✈️ <span>OnePathTravel</span></div>
        <div className="dash-user">
          <span className="dash-name">{user?.name}</span>
          <button className="btn-logout-sm" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
        </div>
      </header>

      <main className="dash-main">
        <h2 className="animate-2 dash-welcome">
          Good to have you, <span className="accent">{user?.name?.split(' ')[0]}</span> 👋
        </h2>
        <p className="animate-2 dash-sub">Where would you like to go today?</p>

        <div className="dash-grid animate-3">
          {FEATURES.map(f => (
            <div key={f.title} className="dash-card">
              <div className="dash-card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
