import { useEffect, useRef } from 'react';

export function useAutoScroll(enabled: boolean, pixelsPerSecond: number, onReachEnd: () => void) {
  const onReachEndRef = useRef(onReachEnd);
  onReachEndRef.current = onReachEnd;

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let last = performance.now();
    let position = window.scrollY;
    let applied = window.scrollY;

    const step = (now: number) => {
      const elapsed = (now - last) / 1000;
      last = now;

      if (Math.abs(window.scrollY - applied) > 1) position = window.scrollY;
      position += pixelsPerSecond * elapsed;
      window.scrollTo(0, position);
      applied = window.scrollY;

      if (applied + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        onReachEndRef.current();
        return;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [enabled, pixelsPerSecond]);
}
