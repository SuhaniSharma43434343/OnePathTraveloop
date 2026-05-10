import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Background3D() {
  const { theme } = useTheme();
  return (
    <div className="nature-bg" data-theme={theme}>
      <div className="aurora-element" />
      <div className="aurora-element-2" />
      {/* Floating orbs */}
      <div className="aurora-orb" style={{
        width: 400, height: 400, top: '10%', left: '5%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
        animationDelay: '0s'
      }} />
      <div className="aurora-orb" style={{
        width: 300, height: 300, top: '60%', right: '10%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
        animationDelay: '-5s'
      }} />
      <div className="aurora-orb" style={{
        width: 250, height: 250, bottom: '15%', left: '40%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        animationDelay: '-10s'
      }} />
    </div>
  );
}
