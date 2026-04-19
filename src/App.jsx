// Copyright (c) 2026 Utkarsh Krishna. All Rights Reserved.
// Proprietary software. Unauthorized use, copying, or distribution is prohibited.
import { useCallback, useEffect, useMemo, useState } from "react";
import BackgroundLayer from "./components/BackgroundLayer";
import ClockDisplay from "./components/ClockDisplay";
import FloatingMenus from "./components/FloatingMenus";
import AttributionWatermark from "./components/AttributionWatermark";
import {
  DIGIT_COLORS,
  FONT_OPTIONS,
  ICONS,
  MODE_ICONS,
  MODES,
  STORAGE_KEYS,
  THEMES,
  TIMER_PRESETS,
} from "./config/clockConfig";
import { useClock } from "./hooks/useClock";
import { useCountdown } from "./hooks/useCountdown";
import { usePomodoro } from "./hooks/usePomodoro";
import { useStopwatch } from "./hooks/useStopwatch";
import { getDateLabel } from "./utils/time";
import { playSoundPattern } from "./utils/sound";
import { readStoredBoolean } from "./utils/storage";
import { CONSOLE_SIGNATURE } from "./config/branding";

function App() {
  const [mode, setMode] = useState("clock");
  const [openMenu, setOpenMenu] = useState("");
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isTwentyFourHour, setIsTwentyFourHour] = useState(false);
  const [animationMode, setAnimationMode] = useState("real");
  const [clockScale, setClockScale] = useState(1);
  const [font, setFont] = useState(
    () => localStorage.getItem(STORAGE_KEYS.font) || "Orbitron",
  );
  const [background, setBackground] = useState(
    () => localStorage.getItem(STORAGE_KEYS.background) || "",
  );
  const [backgroundBlur, setBackgroundBlur] = useState(() =>
    Number(localStorage.getItem(STORAGE_KEYS.backgroundBlur) || 5),
  );
  const [backgroundOverlay, setBackgroundOverlay] = useState(() =>
    Number(localStorage.getItem(STORAGE_KEYS.backgroundOverlay) || 68),
  );
  const [burnInProtection, setBurnInProtection] = useState(() =>
    readStoredBoolean(STORAGE_KEYS.burnInProtection, true),
  );
  const [digitColor, setDigitColor] = useState(
    () =>
      localStorage.getItem(STORAGE_KEYS.digitColor) || DIGIT_COLORS[0].value,
  );
  const [showDate, setShowDate] = useState(() =>
    readStoredBoolean(STORAGE_KEYS.showDate, false),
  );
  const [soundEnabled, setSoundEnabled] = useState(() =>
    readStoredBoolean(STORAGE_KEYS.soundEnabled, false),
  );
  const [dateLabel, setDateLabel] = useState(() => getDateLabel());
  const [burnInOffset, setBurnInOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);

  const clock = useClock(isTwentyFourHour);
  const stopwatch = useStopwatch();

  const notifyComplete = useCallback(() => {
    if (soundEnabled) playSoundPattern("timerDone");
  }, [soundEnabled]);

  const notifyPhase = useCallback(
    (nextPhase) => {
      if (!soundEnabled) return;
      if (nextPhase === "work") {
        playSoundPattern("workStart");
      } else if (nextPhase === "long break") {
        playSoundPattern("longBreakStart");
      } else {
        playSoundPattern("breakStart");
      }
    },
    [soundEnabled],
  );

  const timer = useCountdown(timerMinutes * 60 + timerSeconds, notifyComplete);
  const pomodoro = usePomodoro(
    workMinutes,
    breakMinutes,
    longBreakMinutes,
    Math.max(1, sessionsUntilLongBreak),
    notifyPhase,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.font, font);
  }, [font]);

  useEffect(() => {
    if (background) {
      localStorage.setItem(STORAGE_KEYS.background, background);
    } else {
      localStorage.removeItem(STORAGE_KEYS.background);
    }
  }, [background]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.backgroundBlur, String(backgroundBlur));
  }, [backgroundBlur]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.backgroundOverlay,
      String(backgroundOverlay),
    );
  }, [backgroundOverlay]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.burnInProtection,
      String(burnInProtection),
    );
  }, [burnInProtection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.digitColor, digitColor);
  }, [digitColor]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.showDate, String(showDate));
  }, [showDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.soundEnabled, String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    const interval = window.setInterval(
      () => setDateLabel(getDateLabel()),
      60 * 1000,
    );
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    console.info(CONSOLE_SIGNATURE);
  }, []);

  useEffect(() => {
    if (!burnInProtection) {
      setBurnInOffset({ x: 0, y: 0 });
      return undefined;
    }

    const move = () => {
      setBurnInOffset({
        x: Math.round((Math.random() - 0.5) * 18),
        y: Math.round((Math.random() - 0.5) * 12),
      });
    };

    move();
    const interval = window.setInterval(move, 2 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [burnInProtection]);

  useEffect(() => {
    const updateFullscreen = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  useEffect(() => {
    if (openMenu) {
      setIsUiVisible(true);
      return undefined;
    }

    // Only schedule hide if the UI is currently visible
    if (!isUiVisible) return;

    const timeout = window.setTimeout(() => {
      setIsUiVisible(false);
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [openMenu, isUiVisible]);

  const revealUi = () => {
    setIsUiVisible(true);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };

  const digits = useMemo(() => {
    if (mode === "clock") return clock.digits;
    if (mode === "stopwatch") return stopwatch.digits;
    if (mode === "timer") return timer.digits;
    return pomodoro.digits;
  }, [clock.digits, mode, pomodoro.digits, stopwatch.digits, timer.digits]);

  const period = mode === "clock" && !isTwentyFourHour ? clock.period : "";

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement;

      if (isTyping) return;

      if (event.code === "Space") {
        event.preventDefault();
        if (mode === "stopwatch") {
          stopwatch.isRunning ? stopwatch.pause() : stopwatch.start();
        } else if (mode === "timer") {
          timer.isRunning ? timer.pause() : timer.start();
        } else if (mode === "pomodoro") {
          pomodoro.isRunning ? pomodoro.pause() : pomodoro.start();
        }
      }

      if (event.key.toLowerCase() === "r") {
        if (mode === "stopwatch") stopwatch.reset();
        if (mode === "timer") timer.reset();
        if (mode === "pomodoro") pomodoro.reset();
      }

      if (event.key >= "1" && event.key <= "4") {
        setMode(MODES[Number(event.key) - 1]);
      }

      if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, pomodoro, stopwatch, timer]);

  return (
    <main
      className="app"
      style={{
        "--burn-in-x": `${burnInOffset.x}px`,
        "--burn-in-y": `${burnInOffset.y}px`,
        "--clock-scale": clockScale,
        "--digit-color": digitColor,
        "--digit-font": `"${font}", monospace`,
      }}
      onMouseMove={revealUi}
      onTouchStart={revealUi}
      onKeyDown={revealUi}
    >
      <BackgroundLayer
        background={background}
        backgroundBlur={backgroundBlur}
        backgroundOverlay={backgroundOverlay}
      />

      <FloatingMenus
        visible={isUiVisible}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        mode={mode}
        setMode={setMode}
        isTwentyFourHour={isTwentyFourHour}
        setIsTwentyFourHour={setIsTwentyFourHour}
        animationMode={animationMode}
        setAnimationMode={setAnimationMode}
        clockScale={clockScale}
        setClockScale={setClockScale}
        font={font}
        setFont={setFont}
        background={background}
        setBackground={setBackground}
        backgroundBlur={backgroundBlur}
        setBackgroundBlur={setBackgroundBlur}
        backgroundOverlay={backgroundOverlay}
        setBackgroundOverlay={setBackgroundOverlay}
        burnInProtection={burnInProtection}
        setBurnInProtection={setBurnInProtection}
        digitColor={digitColor}
        setDigitColor={setDigitColor}
        showDate={showDate}
        setShowDate={setShowDate}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        stopwatch={stopwatch}
        timer={timer}
        timerMinutes={timerMinutes}
        setTimerMinutes={setTimerMinutes}
        timerSeconds={timerSeconds}
        setTimerSeconds={setTimerSeconds}
        pomodoro={pomodoro}
        workMinutes={workMinutes}
        setWorkMinutes={setWorkMinutes}
        breakMinutes={breakMinutes}
        setBreakMinutes={setBreakMinutes}
        longBreakMinutes={longBreakMinutes}
        setLongBreakMinutes={setLongBreakMinutes}
        sessionsUntilLongBreak={sessionsUntilLongBreak}
        setSessionsUntilLongBreak={setSessionsUntilLongBreak}
        MODES={MODES}
        MODE_ICONS={MODE_ICONS}
        ICONS={ICONS}
        FONT_OPTIONS={FONT_OPTIONS}
        THEMES={THEMES}
        DIGIT_COLORS={DIGIT_COLORS}
        TIMER_PRESETS={TIMER_PRESETS}
      />

      <ClockDisplay
        digits={digits}
        animationMode={animationMode}
        period={period}
        showDate={showDate}
        dateLabel={dateLabel}
      />

      <AttributionWatermark />
    </main>
  );
}

export default App;
