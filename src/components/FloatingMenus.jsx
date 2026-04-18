import MenuIcon from "./MenuIcon";
import ModeMenu from "./ModeMenu";
import TimeMenu from "./TimeMenu";
import FontMenu from "./FontMenu";
import SettingsMenu from "./SettingsMenu";
import ThemesMenu from "./ThemesMenu";

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
  clockScale,
  setClockScale,
  font,
  setFont,
  background,
  setBackground,
  backgroundBlur,
  setBackgroundBlur,
  backgroundOverlay,
  setBackgroundOverlay,
  burnInProtection,
  setBurnInProtection,
  digitColor,
  setDigitColor,
  showDate,
  setShowDate,
  soundEnabled,
  setSoundEnabled,
  isFullscreen,
  toggleFullscreen,
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
  setBreakMinutes,
  longBreakMinutes,
  setLongBreakMinutes,
  sessionsUntilLongBreak,
  setSessionsUntilLongBreak,
  MODES,
  MODE_ICONS,
  ICONS,
  FONT_OPTIONS,
  THEMES,
  DIGIT_COLORS,
  TIMER_PRESETS,
}) {
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <section
      className={`floating-ui ${visible ? "is-visible" : "is-hidden"}`}
      aria-label="Clock menus"
    >
      <div className="icon-dock glass-panel">
        <MenuIcon
          label="Modes"
          icon={ICONS.mode}
          active={openMenu === "mode"}
          onClick={() => toggleMenu("mode")}
        />
        <MenuIcon
          label="Time controls"
          icon={ICONS.time}
          active={openMenu === "time"}
          onClick={() => toggleMenu("time")}
        />
        <MenuIcon
          label="Fonts"
          icon={ICONS.font}
          active={openMenu === "font"}
          onClick={() => toggleMenu("font")}
        />
        <MenuIcon
          label="Themes"
          icon={ICONS.themes}
          active={openMenu === "themes"}
          onClick={() => toggleMenu("themes")}
        />
        <MenuIcon
          label="Settings"
          icon={ICONS.settings}
          active={openMenu === "settings"}
          onClick={() => toggleMenu("settings")}
        />
      </div>
      {openMenu && (
        <div className="menu-popover glass-panel">
          {openMenu === "mode" && (
            <ModeMenu
              mode={mode}
              setMode={setMode}
              MODES={MODES}
              MODE_ICONS={MODE_ICONS}
            />
          )}
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
              longBreakMinutes={longBreakMinutes}
              setLongBreakMinutes={setLongBreakMinutes}
              sessionsUntilLongBreak={sessionsUntilLongBreak}
              setSessionsUntilLongBreak={setSessionsUntilLongBreak}
              TIMER_PRESETS={TIMER_PRESETS}
            />
          )}
          {openMenu === "font" && (
            <FontMenu
              font={font}
              setFont={setFont}
              FONT_OPTIONS={FONT_OPTIONS}
            />
          )}
          {openMenu === "settings" && (
            <SettingsMenu
              animationMode={animationMode}
              setAnimationMode={setAnimationMode}
              clockScale={clockScale}
              setClockScale={setClockScale}
              burnInProtection={burnInProtection}
              setBurnInProtection={setBurnInProtection}
              showDate={showDate}
              setShowDate={setShowDate}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />
          )}
          {openMenu === "themes" && (
            <ThemesMenu
              background={background}
              setBackground={setBackground}
              backgroundBlur={backgroundBlur}
              setBackgroundBlur={setBackgroundBlur}
              backgroundOverlay={backgroundOverlay}
              setBackgroundOverlay={setBackgroundOverlay}
              digitColor={digitColor}
              setDigitColor={setDigitColor}
              THEMES={THEMES}
              DIGIT_COLORS={DIGIT_COLORS}
            />
          )}
        </div>
      )}
    </section>
  );
}

export default FloatingMenus;
