import { useEffect, useMemo, useRef, useState } from "react";

const MODES = ["clock", "stopwatch", "timer", "pomodoro"];

// To swap icons, change these filenames to any image in the root icons folder.
// The npm scripts copy icons/ into public/icons/ before dev/build.
const ICONS = {
  mode: "/icons/clock.png",
  time: "/icons/time.png",
  font: "T",
  themes: "/icons/background.png",
  settings: "/icons/timer.png",
  clock: "/icons/clock.png",
  stopwatch: "/icons/time.png",
  timer: "/icons/timer.png",
  pomodoro: "/icons/pomodoro.png"
};

const MODE_ICONS = {
  clock: ICONS.clock,
  stopwatch: ICONS.stopwatch,
  timer: ICONS.timer,
  pomodoro: ICONS.pomodoro
};

const FONT_OPTIONS = [
  { label: "Orbitron", value: "Orbitron" },
  { label: "Roboto Mono", value: "Roboto Mono" },
  { label: "Share Tech Mono", value: "Share Tech Mono" },
  { label: "Chakra Petch", value: "Chakra Petch" },
  { label: "Space Mono", value: "Space Mono" }
];

const THEMES = [
  { id: "default", label: "Default", image: "" },
  {
    id: "nature",
    label: "Nature",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80"
  },
  {
    id: "abstract",
    label: "Abstract",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=2400&q=80"
  },
  {
    id: "space",
    label: "Space",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2400&q=80"
  },
  {
    id: "mountain",
    label: "Mountain",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80"
  },
  {
    id: "ocean",
    label: "Ocean",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80"
  },
  {
    id: "custom",
    label: "Custom",
    image: null
  },
  {
    id: "dev-choice",
    label: "Dev's choice",
    image: null
  }
];

const STORAGE_KEYS = {
  background: "flip-clock-background",
  backgroundBlur: "flip-clock-background-blur",
  font: "flip-clock-font"
};

function pad(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function splitDigits(totalSeconds) {
  const safeTotal = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeTotal / 3600);
  const minutes = Math.floor((safeTotal % 3600) / 60);
  const seconds = safeTotal % 60;
  return `${pad(hours)}${pad(minutes)}${pad(seconds)}`.slice(-6).split("");
}

function getClockDigits(isTwentyFourHour) {
  const now = new Date();
  let hours = now.getHours();
  if (!isTwentyFourHour) {
    hours = hours % 12 || 12;
  }
  return `${pad(hours)}${pad(now.getMinutes())}${pad(now.getSeconds())}`.split("");
}

function getClockPeriod() {
  return new Date().getHours() >= 12 ? "PM" : "AM";
}

function useClock(isTwentyFourHour) {
  const [clockState, setClockState] = useState(() => ({
    digits: getClockDigits(isTwentyFourHour),
    period: getClockPeriod()
  }));

  useEffect(() => {
    setClockState({
      digits: getClockDigits(isTwentyFourHour),
      period: getClockPeriod()
    });
    const interval = window.setInterval(() => {
      setClockState({
        digits: getClockDigits(isTwentyFourHour),
        period: getClockPeriod()
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [isTwentyFourHour]);

  return clockState;
}

function useStopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef(0);
  const savedElapsedRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return undefined;

    let animationFrame = 0;
    const tick = () => {
      setElapsedMs(savedElapsedRef.current + performance.now() - startedAtRef.current);
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
    const nextElapsed = savedElapsedRef.current + performance.now() - startedAtRef.current;
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
    reset
  };
}

function useCountdown(initialSeconds) {
  const [duration, setDuration] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const deadlineRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return undefined;

    const tick = () => {
      const nextRemaining = Math.max(0, Math.ceil((deadlineRef.current - performance.now()) / 1000));
      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        setIsRunning(false);
        setIsComplete(true);
      }
    };

    tick();
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
  }, [isRunning]);

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
    setRemaining(Math.max(0, Math.ceil((deadlineRef.current - performance.now()) / 1000)));
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
    reset
  };
}

function usePomodoro(workMinutes, breakMinutes) {
  const [phase, setPhase] = useState("work");
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(workMinutes * 60);
  const deadlineRef = useRef(0);

  useEffect(() => {
    if (isRunning) return;
    setPhase("work");
    setRemaining(Math.max(1, workMinutes) * 60);
  }, [workMinutes, breakMinutes, isRunning]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const switchPhase = () => {
      setPhase((currentPhase) => {
        const nextPhase = currentPhase === "work" ? "break" : "work";
        const nextDuration = (nextPhase === "work" ? workMinutes : breakMinutes) * 60;
        deadlineRef.current = performance.now() + nextDuration * 1000;
        setRemaining(nextDuration);
        return nextPhase;
      });
    };

    const tick = () => {
      const nextRemaining = Math.max(0, Math.ceil((deadlineRef.current - performance.now()) / 1000));
      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        switchPhase();
      }
    };

    tick();
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
  }, [isRunning, workMinutes, breakMinutes]);

  const start = () => {
    if (isRunning) return;
    deadlineRef.current = performance.now() + remaining * 1000;
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    setRemaining(Math.max(1, Math.ceil((deadlineRef.current - performance.now()) / 1000)));
    setIsRunning(false);
  };

  const reset = () => {
    const resetSeconds = Math.max(1, workMinutes) * 60;
    setPhase("work");
    setRemaining(resetSeconds);
    setIsRunning(false);
  };

  return {
    digits: splitDigits(remaining),
    phase,
    isRunning,
    start,
    pause,
    reset
  };
}

function App() {
  const [mode, setMode] = useState("clock");
  const [openMenu, setOpenMenu] = useState("");
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isTwentyFourHour, setIsTwentyFourHour] = useState(true);
  const [animationMode, setAnimationMode] = useState("real");
  const [font, setFont] = useState(() => localStorage.getItem(STORAGE_KEYS.font) || "Orbitron");
  const [background, setBackground] = useState(() => localStorage.getItem(STORAGE_KEYS.background) || "");
  const [backgroundBlur, setBackgroundBlur] = useState(() => Number(localStorage.getItem(STORAGE_KEYS.backgroundBlur) || 5));
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const clock = useClock(isTwentyFourHour);
  const stopwatch = useStopwatch();
  const timer = useCountdown(timerMinutes * 60 + timerSeconds);
  const pomodoro = usePomodoro(workMinutes, breakMinutes);

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
    if (openMenu) {
      setIsUiVisible(true);
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setIsUiVisible(false);
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [openMenu, isUiVisible]);

  const revealUi = () => {
    setIsUiVisible(true);
  };

  const digits = useMemo(() => {
    if (mode === "clock") return clock.digits;
    if (mode === "stopwatch") return stopwatch.digits;
    if (mode === "timer") return timer.digits;
    return pomodoro.digits;
  }, [clock.digits, mode, pomodoro.digits, stopwatch.digits, timer.digits]);

  const period = mode === "clock" && !isTwentyFourHour ? clock.period : "";

  return (
    <main
      className="app"
      style={{ "--digit-font": `"${font}", monospace` }}
      onMouseMove={revealUi}
      onTouchStart={revealUi}
      onKeyDown={revealUi}
    >
      <BackgroundLayer background={background} backgroundBlur={backgroundBlur} />
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
        font={font}
        setFont={setFont}
        background={background}
        setBackground={setBackground}
        backgroundBlur={backgroundBlur}
        setBackgroundBlur={setBackgroundBlur}
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
      />

      <ClockDisplay digits={digits} animationMode={animationMode} period={period} />
    </main>
  );
}

function BackgroundLayer({ background, backgroundBlur }) {
  return (
    <>
      <div
        className="background-layer"
        style={{
          "--background-blur": `${backgroundBlur}px`,
          ...(background ? { backgroundImage: `url("${background}")` } : {})
        }}
      />
      <div className="background-overlay" />
    </>
  );
}

function ClockDisplay({ digits, animationMode, period }) {
  return (
    <section className="clock-display" aria-label="Current time">
      <Digit value={digits[0]} animationMode={animationMode} />
      <Digit value={digits[1]} animationMode={animationMode} />
      <Separator />
      <Digit value={digits[2]} animationMode={animationMode} />
      <Digit value={digits[3]} animationMode={animationMode} />
      <Separator />
      <Digit value={digits[4]} animationMode={animationMode} />
      <Digit value={digits[5]} animationMode={animationMode} />
      {period && <span className="period-badge">{period}</span>}
    </section>
  );
}

function Digit({ value, animationMode }) {
  const [previousValue, setPreviousValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const displayRef = useRef(value);
  const midpointRef = useRef(0);
  const finishRef = useRef(0);

  useEffect(() => {
    if (value === displayRef.current) return undefined;

    window.clearTimeout(midpointRef.current);
    window.clearTimeout(finishRef.current);

    if (animationMode === "simple") {
      setPreviousValue(displayRef.current);
      displayRef.current = value;
      setDisplayValue(value);
      setIsFlipping(false);
      return undefined;
    }

    setPreviousValue(displayRef.current);
    setIsFlipping(true);

    midpointRef.current = window.setTimeout(() => {
      displayRef.current = value;
      setDisplayValue(value);
    }, 300);

    finishRef.current = window.setTimeout(() => {
      setIsFlipping(false);
    }, 660);

    return () => {
      window.clearTimeout(midpointRef.current);
      window.clearTimeout(finishRef.current);
    };
  }, [animationMode, value]);

  return (
    <div className={`digit ${isFlipping ? "is-flipping" : ""}`} aria-label={displayValue}>
      <div className="digit-half digit-static digit-top">
        <span>{displayValue}</span>
      </div>
      <div className="digit-half digit-static digit-bottom">
        <span>{displayValue}</span>
      </div>
      <div className="digit-divider" />
      {animationMode === "real" && (
        <>
          <div className="digit-half digit-animated digit-animated-top">
            <span>{previousValue}</span>
          </div>
          <div className="digit-half digit-animated digit-animated-bottom">
            <span>{value}</span>
          </div>
        </>
      )}
    </div>
  );
}

function Separator() {
  return (
    <div className="separator" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}

function FloatingMenus({
  visible,
  openMenu,
  setOpenMenu,
  mode,
  setMode,
  isTwentyFourHour,
  setIsTwentyFourHour,
  animationMode,
  setAnimationMode,
  font,
  setFont,
  background,
  setBackground,
  backgroundBlur,
  setBackgroundBlur,
  stopwatch,
  timer,
  timerMinutes,
  setTimerMinutes,
  timerSeconds,
  setTimerSeconds,
  pomodoro,
  workMinutes,
  setWorkMinutes,
  breakMinutes,
  setBreakMinutes
}) {
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <section className={`floating-ui ${visible ? "is-visible" : "is-hidden"}`} aria-label="Clock menus">
      <div className="icon-dock glass-panel">
        <MenuIcon label="Modes" icon={ICONS.mode} active={openMenu === "mode"} onClick={() => toggleMenu("mode")} />
        <MenuIcon label="Time controls" icon={ICONS.time} active={openMenu === "time"} onClick={() => toggleMenu("time")} />
        <MenuIcon label="Fonts" icon={ICONS.font} active={openMenu === "font"} onClick={() => toggleMenu("font")} />
        <MenuIcon label="Themes" icon={ICONS.themes} active={openMenu === "themes"} onClick={() => toggleMenu("themes")} />
        <MenuIcon label="Settings" icon={ICONS.settings} active={openMenu === "settings"} onClick={() => toggleMenu("settings")} />
      </div>

      {openMenu && (
        <div className="menu-popover glass-panel">
          {openMenu === "mode" && <ModeMenu mode={mode} setMode={setMode} />}
          {openMenu === "time" && (
            <TimeMenu
              mode={mode}
              isTwentyFourHour={isTwentyFourHour}
              setIsTwentyFourHour={setIsTwentyFourHour}
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
            />
          )}
          {openMenu === "font" && <FontMenu font={font} setFont={setFont} />}
          {openMenu === "settings" && (
            <SettingsMenu
              animationMode={animationMode}
              setAnimationMode={setAnimationMode}
            />
          )}
          {openMenu === "themes" && (
            <ThemesMenu
              background={background}
              setBackground={setBackground}
              backgroundBlur={backgroundBlur}
              setBackgroundBlur={setBackgroundBlur}
            />
          )}
        </div>
      )}
    </section>
  );
}

function MenuIcon({ label, icon, active, onClick }) {
  return (
    <button type="button" className={`menu-icon ${active ? "active" : ""}`} onClick={onClick} aria-label={label} title={label}>
      <IconAsset icon={icon} alt="" />
    </button>
  );
}

function IconAsset({ icon, alt }) {
  if (typeof icon === "string" && /\.(png|jpe?g|webp|gif|svg)$/i.test(icon)) {
    return <img className="ui-icon-image" src={icon} alt={alt} draggable="false" />;
  }

  return <span className="ui-icon-text">{icon}</span>;
}

function ModeMenu({ mode, setMode }) {
  return (
    <div className="menu-section">
      <span className="menu-title">Mode</span>
      <div className="icon-grid">
        {MODES.map((item) => (
          <button
            key={item}
            type="button"
            className={`menu-choice ${item === mode ? "active" : ""}`}
            onClick={() => setMode(item)}
            aria-label={item}
            title={item}
          >
            <IconAsset icon={MODE_ICONS[item]} alt="" />
            <small>{item}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function TimeMenu({
  mode,
  isTwentyFourHour,
  setIsTwentyFourHour,
  stopwatch,
  timer,
  timerMinutes,
  setTimerMinutes,
  timerSeconds,
  setTimerSeconds,
  pomodoro,
  workMinutes,
  setWorkMinutes,
  breakMinutes,
  setBreakMinutes
}) {
  return (
    <div className="menu-section">
      <span className="menu-title">Time</span>
      {mode === "clock" && (
        <button type="button" className="pill-button" onClick={() => setIsTwentyFourHour(!isTwentyFourHour)}>
          {isTwentyFourHour ? "24h" : "12h"}
        </button>
      )}

      {mode === "stopwatch" && (
        <div className="control-strip">
          <IconButton label="Start" onClick={stopwatch.start} icon="▶" />
          <IconButton label="Pause" onClick={stopwatch.pause} icon="Ⅱ" />
          <IconButton label="Reset" onClick={stopwatch.reset} icon="↺" />
        </div>
      )}

      {mode === "timer" && (
        <div className="control-strip">
          <NumberField label="Min" value={timerMinutes} onChange={setTimerMinutes} max={999} />
          <NumberField label="Sec" value={timerSeconds} onChange={setTimerSeconds} max={59} />
          <IconButton label="Set timer" onClick={() => timer.configure(timerMinutes * 60 + timerSeconds)} icon="✓" />
          <IconButton label="Start" onClick={timer.start} icon="▶" />
          <IconButton label="Pause" onClick={timer.pause} icon="Ⅱ" />
          <IconButton label="Reset" onClick={timer.reset} icon="↺" />
          {timer.isComplete && <span className="state-chip">done</span>}
        </div>
      )}

      {mode === "pomodoro" && (
        <div className="control-strip">
          <NumberField label="Work" value={workMinutes} onChange={setWorkMinutes} max={999} />
          <NumberField label="Break" value={breakMinutes} onChange={setBreakMinutes} max={999} />
          <IconButton label="Start" onClick={pomodoro.start} icon="▶" />
          <IconButton label="Pause" onClick={pomodoro.pause} icon="Ⅱ" />
          <IconButton label="Reset" onClick={pomodoro.reset} icon="↺" />
          <span className="state-chip">{pomodoro.phase}</span>
        </div>
      )}
    </div>
  );
}

function FontMenu({ font, setFont }) {
  return (
    <div className="menu-section">
      <span className="menu-title">Font</span>
      <label className="select-label wide-select">
        <span>Digits</span>
        <select value={font} onChange={(event) => setFont(event.target.value)}>
          {FONT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function SettingsMenu({ animationMode, setAnimationMode }) {
  return (
    <div className="menu-section">
      <span className="menu-title">Settings</span>
      <button
        type="button"
        className="pill-button"
        onClick={() => setAnimationMode(animationMode === "real" ? "simple" : "real")}
      >
        <span>Animations</span>
        <strong>{animationMode === "real" ? "real flip" : "simple"}</strong>
      </button>
    </div>
  );
}

function ThemesMenu({ background, setBackground, backgroundBlur, setBackgroundBlur }) {
  const [devChoices, setDevChoices] = useState([]);
  const [activeTheme, setActiveTheme] = useState(() => {
    const matchingTheme = THEMES.find((theme) => theme.image === background);
    if (background.startsWith("/dev-choices/")) return "dev-choice";
    return matchingTheme?.id || (background ? "custom" : "default");
  });
  const [customChoice, setCustomChoice] = useState("");

  useEffect(() => {
    fetch("/dev-choices/manifest.json")
      .then((response) => (response.ok ? response.json() : []))
      .then((items) => setDevChoices(Array.isArray(items) ? items : []))
      .catch(() => setDevChoices([]));
  }, []);

  const chooseTheme = (theme) => {
    setActiveTheme(theme.id);
    if (theme.image !== null) {
      setBackground(theme.image);
      setCustomChoice("");
    }
  };

  const setCustomBackground = (nextBackground) => {
    setActiveTheme("custom");
    setBackground(nextBackground);
  };

  const setDevChoiceBackground = (nextBackground) => {
    setActiveTheme("dev-choice");
    setBackground(nextBackground);
  };

  const blurPercent = (backgroundBlur / 14) * 100;

  return (
    <div className="menu-section theme-menu">
      <span className="menu-title">Themes</span>
      <div className="theme-grid">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`theme-tile ${activeTheme === theme.id ? "active" : ""}`}
            style={theme.image ? { backgroundImage: `url("${theme.image}")` } : undefined}
            onClick={() => chooseTheme(theme)}
          >
            <span>{theme.label}</span>
          </button>
        ))}
      </div>

      <label className="range-label">
        <span>Blur</span>
        <span className="range-wrap" style={{ "--range-value": `${blurPercent}%` }}>
          <input
            type="range"
            min="0"
            max="14"
            value={backgroundBlur}
            onChange={(event) => setBackgroundBlur(Number(event.target.value))}
          />
          <strong>{backgroundBlur}px</strong>
        </span>
      </label>

      {activeTheme === "dev-choice" && (
        <div className="dev-choice-panel">
          {devChoices.length > 0 ? (
            <div className="theme-grid">
              {devChoices.map((choice) => (
                <button
                  key={choice.url}
                  type="button"
                  className={`theme-tile ${background === choice.url ? "active" : ""}`}
                  style={{ backgroundImage: `url("${choice.url}")` }}
                  onClick={() => setDevChoiceBackground(choice.url)}
                >
                  <span>{choice.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="empty-note">Add images to dev-choices, then run dev or build.</p>
          )}
        </div>
      )}

      {activeTheme === "custom" && (
        <div className="custom-theme">
          <div className="segmented-row">
            <button
              type="button"
              className={`pill-button ${customChoice === "upload" ? "active" : ""}`}
              onClick={() => setCustomChoice("upload")}
            >
              Upload
            </button>
            <button
              type="button"
              className={`pill-button ${customChoice === "link" ? "active" : ""}`}
              onClick={() => setCustomChoice("link")}
            >
              Link
            </button>
          </div>
          {customChoice === "upload" && <UploadBackground setBackground={setCustomBackground} />}
          {customChoice === "link" && <LinkBackground setBackground={setCustomBackground} />}
        </div>
      )}

      {background && (
        <button
          type="button"
          className="pill-button subtle-button"
          onClick={() => {
            setActiveTheme("default");
            setCustomChoice("");
            setBackground("");
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

function UploadBackground({ setBackground }) {
  const fileInputRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBackground(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="background-choice">
      <button type="button" className="pill-button" onClick={() => fileInputRef.current?.click()}>
        Choose image
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} hidden />
    </div>
  );
}

function LinkBackground({ setBackground }) {
  const [url, setUrl] = useState("");
  const applyUrl = () => {
    const nextUrl = url.trim();
    if (nextUrl) setBackground(nextUrl);
  };

  return (
    <div className="background-choice">
      <input
        className="url-input"
        type="url"
        placeholder="Paste image URL"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") applyUrl();
        }}
      />
      <button type="button" className="pill-button" onClick={applyUrl}>
        Apply
      </button>
    </div>
  );
}

function NumberField({ label, value, onChange, max }) {
  return (
    <label className="number-label">
      <span>{label}</span>
      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(event) => onChange(Math.min(max, Math.max(0, Number(event.target.value))))}
      />
    </label>
  );
}

function IconButton({ label, icon, onClick }) {
  return (
    <button type="button" className="icon-button" onClick={onClick} aria-label={label} title={label}>
      {icon}
    </button>
  );
}

export default App;
