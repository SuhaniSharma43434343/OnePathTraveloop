import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { useTheme } from '../context/ThemeContext';

export default function LottieOverlay({
  animationData,
  show,
  onDone,
  minDuration = 1500,
  skipThreshold = 300,
  loop = false,
  label = 'Loading',
}) {
  const { theme } = useTheme();
  const [phase, setPhase] = useState('hidden');

  // Keep latest values in refs so the effect closure never goes stale
  const phaseRef      = useRef('hidden');
  const startRef      = useRef(null);
  const timerRef      = useRef(null);
  const doneRef       = useRef(false);
  const onDoneRef     = useRef(onDone);
  const minDurRef     = useRef(minDuration);
  const skipThreshRef = useRef(skipThreshold);

  // Keep refs in sync with props on every render
  onDoneRef.current     = onDone;
  minDurRef.current     = minDuration;
  skipThreshRef.current = skipThreshold;

  const setPhaseSync = (p) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const fadeOut = () => {
    if (doneRef.current) return;
    clearTimeout(timerRef.current);
    setPhaseSync('fading');
    timerRef.current = setTimeout(() => {
      doneRef.current = true;
      setPhaseSync('hidden');
      onDoneRef.current?.();
    }, 420);
  };

  useEffect(() => {
    if (show) {
      doneRef.current  = false;
      startRef.current = Date.now();
      setPhaseSync('visible');
    } else {
      if (phaseRef.current !== 'visible') return;

      const elapsed   = Date.now() - (startRef.current ?? 0);
      const remaining = minDurRef.current - elapsed;

      if (elapsed < skipThreshRef.current) {
        doneRef.current = true;
        setPhaseSync('hidden');
        onDoneRef.current?.();
      } else if (remaining > 0) {
        timerRef.current = setTimeout(fadeOut, remaining);
      } else {
        fadeOut();
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [show]);

  if (phase === 'hidden') return null;

  const isDark = theme !== 'light';

  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      style={{
        position:             'fixed',
        inset:                0,
        zIndex:               9999,
        display:              'flex',
        flexDirection:        'column',
        alignItems:           'center',
        justifyContent:       'center',
        gap:                  '1rem',
        background:           isDark ? 'rgba(0,27,46,0.90)' : 'rgba(224,242,241,0.90)',
        backdropFilter:       'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        opacity:              phase === 'fading' ? 0 : 1,
        transition:           'opacity 0.42s ease',
        pointerEvents:        phase === 'fading' ? 'none' : 'all',
      }}
    >
      <div style={{ width: 'min(72vw, 300px)', height: 'min(72vw, 300px)' }}>
        <Lottie
          animationData={animationData}
          loop={loop}
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <p style={{
        fontSize:      '0.72rem',
        fontWeight:    500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color:         isDark ? 'rgba(144,224,239,0.7)' : 'rgba(0,119,182,0.7)',
      }}>
        {label}
      </p>
    </div>
  );
}
