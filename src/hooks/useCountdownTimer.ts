// ============================================================================
// 🌴 VICE DYNASTY - ACCURATE COUNTDOWN TIMER HOOK
// ============================================================================

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseCountdownTimerOptions {
  onComplete: () => void;
  onTick?: (progress: number, remaining: number) => void;
}

export function useCountdownTimer({ onComplete, onTick }: UseCountdownTimerOptions) {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [remaining, setRemaining] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const pausedTimeRef = useRef<number>(0);
  const totalPausedDurationRef = useRef<number>(0);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const cleanup = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setIsActive(false);
    setProgress(100);
    setRemaining(0);
    totalPausedDurationRef.current = 0;
    pausedTimeRef.current = 0;
  }, [cleanup]);

  const start = useCallback(
    (durationSec: number, tickMs: number = 50) => {
      cleanup();
      setIsActive(true);
      durationRef.current = durationSec;
      startTimeRef.current = performance.now();
      totalPausedDurationRef.current = 0;
      pausedTimeRef.current = 0;
      setRemaining(durationSec);
      setProgress(100);

      intervalRef.current = window.setInterval(() => {
        if (isPausedRef.current) return;

        const now = performance.now();
        const elapsedSec = (now - startTimeRef.current - totalPausedDurationRef.current) / 1000;
        const left = Math.max(0, durationSec - elapsedSec);
        const pct = Math.max(0, Math.min(100, (left / durationSec) * 100));

        setRemaining(left);
        setProgress(pct);
        onTickRef.current?.(pct, left);

        if (left <= 0) {
          cleanup();
          setIsActive(false);
          onCompleteRef.current();
        }
      }, tickMs);
    },
    [cleanup]
  );

  const setPaused = useCallback((paused: boolean) => {
    if (isPausedRef.current === paused) return;
    isPausedRef.current = paused;
    if (paused) {
      pausedTimeRef.current = performance.now();
    } else if (pausedTimeRef.current > 0) {
      totalPausedDurationRef.current += performance.now() - pausedTimeRef.current;
      pausedTimeRef.current = 0;
    }
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    isActive,
    progress,
    remaining,
    start,
    stop,
    setPaused
  };
}
