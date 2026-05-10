import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './styles/ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
