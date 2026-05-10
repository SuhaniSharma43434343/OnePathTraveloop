import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Background3D() {
  const { theme } = useTheme();

  const bubbles = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      size: 30 + Math.random() * 70,
      left: Math.random() * 100,
      delay: Math.random() * 18,
      duration: 14 + Math.random() * 14,
    })), []);

  return (
    <div className="water-container" data-theme={theme}>
      {/* Deep ocean glow layers */}
      <div className="water-glow" style={{ top: '-10%', left: '-5%' }} />
      <div className="water-glow" style={{ bottom: '5%', right: '-8%', animationDelay: '7s' }} />
      <div className="water-glow-light" style={{ top: '15%', right: '10%', animationDelay: '3s' }} />
      <div className="water-glow-mid" style={{ top: '45%', left: '25%', animationDelay: '11s' }} />

      {/* Animated wave layers */}
      <div className="wave wave-1" />
      <div className="wave wave-2" />
      <div className="wave wave-3" />

      {/* Rising bubbles */}
      {bubbles.map(b => (
        <div key={b.id} className="water-bubble"
          style={{
            width: b.size, height: b.size,
            left: `${b.left}%`, bottom: '-10%',
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
