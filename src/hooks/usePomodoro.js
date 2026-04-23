import { useEffect, useRef, useState } from "react";
import { splitDigits } from "../utils/time";

export function usePomodoro(
  workMinutes,
  breakMinutes,
  longBreakMinutes,
  sessionsUntilLongBreak,
  onPhaseChange,
) {
  const [phase, setPhase] = useState("work");
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(workMinutes * 60);
  const [completedSessions, setCompletedSessions] = useState(0);
  const deadlineRef = useRef(0);

  // Update phase and remaining when settings change while not running
  useEffect(() => {
    if (isRunning) return;
    setPhase("work");
    setRemaining(Math.max(1, workMinutes) * 60);
  }, [workMinutes, breakMinutes, longBreakMinutes, isRunning]);

  // Main countdown logic
  useEffect(() => {
    if (!isRunning) return;

    const switchPhase = () => {
      setPhase((currentPhase) => {
        let nextPhase = "work";
        let nextDuration = workMinutes * 60;

        if (currentPhase === "work") {
          const nextCompletedSessions = completedSessions + 1;
          setCompletedSessions(nextCompletedSessions);
          nextPhase =
            nextCompletedSessions % sessionsUntilLongBreak === 0
              ? "long break"
              : "break";
          nextDuration =
            (nextPhase === "long break" ? longBreakMinutes : breakMinutes) * 60;
        }

        deadlineRef.current = Date.now() + nextDuration * 1000;
        setRemaining(nextDuration);
        onPhaseChange?.(nextPhase);
        return nextPhase;
      });
    };

    const tick = () => {
      const now = Date.now();
      const remainingSeconds = Math.max(
        0,
        Math.ceil((deadlineRef.current - now) / 1000),
      );
      setRemaining(remainingSeconds);

      if (remainingSeconds <= 0) {
        switchPhase();
      }
    };

    // Initial tick to ensure display is correct
    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [
    breakMinutes,
    completedSessions,
    isRunning,
    longBreakMinutes,
    onPhaseChange,
    sessionsUntilLongBreak,
    workMinutes,
  ]);

  const start = () => {
    if (isRunning) return;
    deadlineRef.current = Date.now() + remaining * 1000;
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    const now = Date.now();
    const newRemaining = Math.max(
      1,
      Math.ceil((deadlineRef.current - now) / 1000),
    );
    setRemaining(newRemaining);
    setIsRunning(false);
  };

  const reset = () => {
    const resetSeconds = Math.max(1, workMinutes) * 60;
    setPhase("work");
    setRemaining(resetSeconds);
    setCompletedSessions(0);
    setIsRunning(false);
  };

  return {
    digits: splitDigits(remaining),
    completedSessions,
    phase,
    isRunning,
    start,
    pause,
    reset,
  };
}
