import { useEffect, useRef, useState } from "react";
import { splitDigits } from "../utils/time";

export function useStopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef(0);
  const accumulatedSecondsRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const totalSeconds =
        accumulatedSecondsRef.current + (now - startTimeRef.current) / 1000;
      setElapsedSeconds(totalSeconds);
    }, 1000);

    startTimeRef.current = Date.now();

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    if (isRunning) return;
    startTimeRef.current = Date.now();
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    const now = Date.now();
    accumulatedSecondsRef.current += (now - startTimeRef.current) / 1000;
    setElapsedSeconds(accumulatedSecondsRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    accumulatedSecondsRef.current = 0;
    setElapsedSeconds(0);
    setIsRunning(false);
  };

  return {
    digits: splitDigits(elapsedSeconds),
    isRunning,
    start,
    pause,
    reset,
  };
}
