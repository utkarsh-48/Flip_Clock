function SettingsMenu({
  animationMode,
  setAnimationMode,
  clockScale,
  setClockScale,
  burnInProtection,
  setBurnInProtection,
  showDate,
  setShowDate,
  soundEnabled,
  setSoundEnabled,
  isFullscreen,
  toggleFullscreen,
}) {
  const clockScalePercent = Math.round(clockScale * 100);
  const rangeValue = ((clockScale - 1) / 0.5) * 100;

  return (
    <div className="menu-section">
      <span className="menu-title">Settings</span>
      <label className="range-label">
        <span>Clock size</span>
        <span
          className="range-wrap"
          style={{ "--range-value": `${rangeValue}%` }}
        >
          <input
            type="range"
            min="1"
            max="1.5"
            step="0.05"
            value={clockScale}
            onChange={(event) => setClockScale(Number(event.target.value))}
          />
          <strong>{clockScalePercent}%</strong>
        </span>
      </label>
      <button
        type="button"
        className="pill-button"
        onClick={() =>
          setAnimationMode(animationMode === "real" ? "simple" : "real")
        }
      >
        <span>Animations</span>
        <strong>{animationMode === "real" ? "real flip" : "simple"}</strong>
      </button>
      <button
        type="button"
        className="pill-button"
        onClick={() => setSoundEnabled(!soundEnabled)}
      >
        <span>Sound</span>
        <strong>{soundEnabled ? "on" : "off"}</strong>
      </button>
      <button
        type="button"
        className="pill-button"
        onClick={() => setShowDate(!showDate)}
      >
        <span>Date</span>
        <strong>{showDate ? "show" : "hide"}</strong>
      </button>
      <button
        type="button"
        className="pill-button"
        onClick={() => setBurnInProtection(!burnInProtection)}
      >
        <span>Burn-in</span>
        <strong>{burnInProtection ? "on" : "off"}</strong>
      </button>
      <button type="button" className="pill-button" onClick={toggleFullscreen}>
        <span>Fullscreen</span>
        <strong>{isFullscreen ? "exit" : "enter"}</strong>
      </button>
      <span className="shortcut-note">
        Space play/pause · R reset · 1-4 modes · F fullscreen
      </span>
    </div>
  );
}

export default SettingsMenu;
