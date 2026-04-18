import { useEffect, useState } from "react";
import { getClockDigits, getClockPeriod } from "../utils/time";

export function useClock(isTwentyFourHour) {
  const [clockState, setClockState] = useState(() => ({
    digits: getClockDigits(isTwentyFourHour),
    period: getClockPeriod(),
  }));

  useEffect(() => {
    setClockState({
      digits: getClockDigits(isTwentyFourHour),
      period: getClockPeriod(),
    });
    const interval = window.setInterval(() => {
      setClockState({
        digits: getClockDigits(isTwentyFourHour),
        period: getClockPeriod(),
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [isTwentyFourHour]);

  return clockState;
}
