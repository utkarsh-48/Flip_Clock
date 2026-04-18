import React, { useState, useEffect } from "react";
import UploadBackground from "./UploadBackground";
import LinkBackground from "./LinkBackground";

function ThemesMenu({
  background,
  setBackground,
  backgroundBlur,
  setBackgroundBlur,
  backgroundOverlay,
  setBackgroundOverlay,
  digitColor,
  setDigitColor,
  THEMES,
  DIGIT_COLORS,
}) {
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
            style={
              theme.image
                ? { backgroundImage: `url("${theme.image}")` }
                : undefined
            }
            onClick={() => chooseTheme(theme)}
          >
            <span>{theme.label}</span>
          </button>
        ))}
      </div>

      <label className="range-label">
        <span>Blur</span>
        <span
          className="range-wrap"
          style={{ "--range-value": `${blurPercent}%` }}
        >
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

      <label className="range-label">
        <span>Dark</span>
        <span
          className="range-wrap"
          style={{ "--range-value": `${backgroundOverlay}%` }}
        >
          <input
            type="range"
            min="0"
            max="90"
            value={backgroundOverlay}
            onChange={(event) =>
              setBackgroundOverlay(Number(event.target.value))
            }
          />
          <strong>{backgroundOverlay}%</strong>
        </span>
      </label>

      <div className="color-row">
        {DIGIT_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            className={`color-swatch ${digitColor === color.value ? "active" : ""}`}
            style={{ "--swatch-color": color.value }}
            onClick={() => setDigitColor(color.value)}
            aria-label={color.label}
            title={color.label}
          />
        ))}
        <input
          className="custom-color"
          type="color"
          value={digitColor}
          onChange={(event) => setDigitColor(event.target.value)}
          aria-label="Custom digit color"
        />
      </div>

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
            <p className="empty-note">
              Add images to dev-choices, then run dev or build.
            </p>
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
          {customChoice === "upload" && (
            <UploadBackground setBackground={setCustomBackground} />
          )}
          {customChoice === "link" && (
            <LinkBackground setBackground={setCustomBackground} />
          )}
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

export default ThemesMenu;
