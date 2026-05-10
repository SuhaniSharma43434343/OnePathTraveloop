import { useState, useCallback, useRef } from 'react';

/**
 * useLottieTransition
 *
 * Coordinates the Lottie overlay with an async action.
 * - Overlay starts immediately when run() is called
 * - Async work runs in parallel
 * - When work finishes, overlay begins its exit (respecting minDuration)
 * - onComplete fires after the overlay fully fades out
 *
 * Usage:
 *   const { showOverlay, run, handleDone } = useLottieTransition();
 *
 *   // In a click handler:
 *   run(
 *     async () => { await someApiCall(); },
 *     () => { navigate('/somewhere'); }   // called after fade-out
 *   );
 *
 *   // In JSX:
 *   <LottieOverlay show={showOverlay} onDone={handleDone} ... />
 */
export default function useLottieTransition() {
  const [showOverlay, setShowOverlay] = useState(false);
  const onCompleteRef = useRef(null);

  const run = useCallback((asyncFn, onComplete) => {
    onCompleteRef.current = onComplete ?? null;
    setShowOverlay(true);

    // Fire async work — do NOT await here so the overlay renders immediately
    Promise.resolve()
      .then(() => asyncFn())
      .finally(() => setShowOverlay(false));
  }, []);

  const handleDone = useCallback(() => {
    const cb = onCompleteRef.current;
    onCompleteRef.current = null;
    cb?.();
  }, []);

  return { showOverlay, run, handleDone };
}
