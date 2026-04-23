import { useEffect, useState } from "react";
import { getClockDigits, getClockPeriod } from "../utils/time";

export function useClock(isTwentyFourHour) {
  const [clockState, setClockState] = useState({
    digits: getClockDigits(isTwentyFourHour),
    period: getClockPeriod(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setClockState({
        digits: getClockDigits(isTwentyFourHour),
        period: getClockPeriod(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTwentyFourHour]);

  return clockState;
}
