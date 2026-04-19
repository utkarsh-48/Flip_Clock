import { useEffect, useRef, useState } from "react";
import { splitDigits } from "../utils/time";

export function useCountdown(initialSeconds, onComplete) {
  const [duration, setDuration] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const deadlineRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      const now = Date.now();
      const remainingSeconds = Math.max(
        0,
        Math.ceil((deadlineRef.current - now) / 1000),
      );
      setRemaining(remainingSeconds);

      if (remainingSeconds <= 0) {
        setIsRunning(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    tick(); // immediate first tick
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  const configure = (nextDuration) => {
    const safeDuration = Math.max(0, nextDuration);
    setDuration(safeDuration);
    setRemaining(safeDuration);
    setIsRunning(false);
    setIsComplete(false);
  };

  const start = () => {
    if (remaining <= 0) return;
    deadlineRef.current = Date.now() + remaining * 1000;
    setIsComplete(false);
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    const now = Date.now();
    const newRemaining = Math.max(
      0,
      Math.ceil((deadlineRef.current - now) / 1000),
    );
    setRemaining(newRemaining);
    setIsRunning(false);
  };

  const reset = () => {
    setRemaining(duration);
    setIsRunning(false);
    setIsComplete(false);
  };

  return {
    digits: splitDigits(remaining),
    duration,
    remaining,
    isRunning,
    isComplete,
    configure,
    start,
    pause,
    reset,
  };
}
