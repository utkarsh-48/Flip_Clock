import { useEffect, useRef, useState } from "react";
import { splitDigits } from "../utils/time";

export function useCountdown(initialSeconds, onComplete) {
  const [duration, setDuration] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const deadlineRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return undefined;

    const tick = () => {
      const nextRemaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - performance.now()) / 1000),
      );
      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        setIsRunning(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    tick();
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
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
    deadlineRef.current = performance.now() + remaining * 1000;
    setIsComplete(false);
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    setRemaining(
      Math.max(0, Math.ceil((deadlineRef.current - performance.now()) / 1000)),
    );
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
