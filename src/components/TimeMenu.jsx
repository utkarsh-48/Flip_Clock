import React from "react";
import IconButton from "./IconButton";
import NumberField from "./NumberField";

const POMODORO_PHASE_LABELS = {
  work: "Focus time",
  break: "Short break",
  "long break": "Long break",
};

function getPomodoroPhaseLabel(phase) {
  return POMODORO_PHASE_LABELS[phase] || phase;
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
  setBreakMinutes,
  longBreakMinutes,
  setLongBreakMinutes,
  sessionsUntilLongBreak,
  setSessionsUntilLongBreak,
  TIMER_PRESETS,
}) {
  return (
    <div className="menu-section">
      <span className="menu-title">Time</span>
      {mode === "clock" && (
        <button
          type="button"
          className="pill-button"
          onClick={() => setIsTwentyFourHour(!isTwentyFourHour)}
        >
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
        <>
          <div className="preset-row">
            {TIMER_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="pill-button"
                onClick={() => {
                  setTimerMinutes(Math.floor(preset.seconds / 60));
                  setTimerSeconds(preset.seconds % 60);
                  timer.configure(preset.seconds);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="control-strip">
            <NumberField
              label="Min"
              value={timerMinutes}
              onChange={setTimerMinutes}
              max={999}
            />
            <NumberField
              label="Sec"
              value={timerSeconds}
              onChange={setTimerSeconds}
              max={59}
            />
            <IconButton
              label="Set timer"
              onClick={() => timer.configure(timerMinutes * 60 + timerSeconds)}
              icon="✓"
            />
            <IconButton label="Start" onClick={timer.start} icon="▶" />
            <IconButton label="Pause" onClick={timer.pause} icon="Ⅱ" />
            <IconButton label="Reset" onClick={timer.reset} icon="↺" />
            {timer.isComplete && <span className="state-chip">done</span>}
          </div>
        </>
      )}

      {mode === "pomodoro" && (
        <div className="pomodoro-controls">
          <div className="control-strip">
            <NumberField
              label="Work"
              value={workMinutes}
              onChange={setWorkMinutes}
              max={999}
            />
            <NumberField
              label="Break"
              value={breakMinutes}
              onChange={setBreakMinutes}
              max={999}
            />
            <NumberField
              label="Long"
              value={longBreakMinutes}
              onChange={setLongBreakMinutes}
              max={999}
            />
            <NumberField
              label="Cycle"
              value={sessionsUntilLongBreak}
              onChange={setSessionsUntilLongBreak}
              max={12}
              min={1}
            />
          </div>
          <div className="control-strip control-strip-no-wrap">
            <IconButton label="Start" onClick={pomodoro.start} icon="▶" />
            <IconButton label="Pause" onClick={pomodoro.pause} icon="Ⅱ" />
            <IconButton label="Reset" onClick={pomodoro.reset} icon="↺" />
            <span
              className={`state-chip phase-chip phase-${pomodoro.phase.replace(" ", "-")}`}
            >
              {getPomodoroPhaseLabel(pomodoro.phase)}
            </span>
            <span className="state-chip">{pomodoro.completedSessions} done</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeMenu;
