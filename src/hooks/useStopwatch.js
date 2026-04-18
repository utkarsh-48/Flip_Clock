import { useEffect, useRef, useState } from "react";
import { splitDigits } from "../utils/time";

export function useStopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef(0);
  const savedElapsedRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return undefined;

    let animationFrame = 0;
    const tick = () => {
      setElapsedMs(
        savedElapsedRef.current + performance.now() - startedAtRef.current,
      );
      animationFrame = window.requestAnimationFrame(tick);
    };

    startedAtRef.current = performance.now();
    animationFrame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isRunning]);

  const start = () => {
    if (isRunning) return;
    startedAtRef.current = performance.now();
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    const nextElapsed =
      savedElapsedRef.current + performance.now() - startedAtRef.current;
    savedElapsedRef.current = nextElapsed;
    setElapsedMs(nextElapsed);
    setIsRunning(false);
  };

  const reset = () => {
    savedElapsedRef.current = 0;
    startedAtRef.current = performance.now();
    setElapsedMs(0);
    setIsRunning(false);
  };

  return {
    digits: splitDigits(elapsedMs / 1000),
    isRunning,
    start,
    pause,
    reset,
  };
}
