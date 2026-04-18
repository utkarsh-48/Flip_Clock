# Flip Clock

A customizable fullscreen-style React flip clock app with multiple time modes, theme controls, keyboard shortcuts, and personal branding.

## Features

- Live clock mode (12h/24h)
- Stopwatch mode
- Countdown timer mode with presets
- Pomodoro mode with work/break/long-break cycles
- Real flip animation or simple display mode
- Theme/background controls
- Font and digit color controls
- Burn-in protection jitter for static displays
- Optional date strip and AM/PM badge
- Keyboard shortcuts for quick control
- Attribution watermark linked to creator GitHub

## Tech Stack

- React
- Vite
- Plain CSS

## Getting Started

## Prerequisites

- Node.js 18+
- npm

## Install

```bash
npm install
```

## Run (Dev)

```bash
npm run dev
```

The app is configured to prefer port 3000. If 3000 is busy, Vite picks the next available port.

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Controls

### Mouse / Touch

- Move mouse or tap to reveal floating controls.

### Keyboard

- `Space`: play/pause stopwatch, timer, or pomodoro
- `R`: reset stopwatch, timer, or pomodoro
- `1`-`4`: switch mode (clock / stopwatch / timer / pomodoro)
- `F`: toggle fullscreen

## Project Structure

```text
src/
  App.jsx
  styles.css
  main.jsx
  components/
    AttributionWatermark.jsx
    BackgroundLayer.jsx
    ClockDisplay.jsx
    Digit.jsx
    FloatingMenus.jsx
    FontMenu.jsx
    IconAsset.jsx
    IconButton.jsx
    LinkBackground.jsx
    MenuIcon.jsx
    ModeMenu.jsx
    NumberField.jsx
    Separator.jsx
    SettingsMenu.jsx
    ThemesMenu.jsx
    TimeMenu.jsx
    UploadBackground.jsx
  config/
    branding.js
    clockConfig.js
  hooks/
    useClock.js
    useCountdown.js
    usePomodoro.js
    useStopwatch.js
  utils/
    sound.js
    storage.js
    time.js
scripts/
  sync-icons.mjs
icons/
dev-choices/
```

## Customization

### Change Dock/Clock Styling

Edit `src/styles.css`.

### Change Mode/Theme Defaults and Static Options

Edit `src/config/clockConfig.js`.

### Change Branding / Attribution

Edit `src/config/branding.js`.

### Add Custom Icons

1. Add icon files to `icons/`.
2. Run `npm run dev` or `npm run build`.
3. `scripts/sync-icons.mjs` copies icons to `public/icons/` automatically.

### Add Dev Choice Backgrounds

1. Add image files to `dev-choices/`.
2. Run `npm run dev` or `npm run build`.
3. `scripts/sync-icons.mjs` copies files to `public/dev-choices/` and generates `manifest.json`.

## Notes

- Dev-choice images are copied as-is (no compression or resize in project code).
- Background blur and overlay in CSS can make images look softer.

## Attribution

Created by Utkarsh Krishna.
GitHub: https://github.com/utkarsh-48

## License

This project is proprietary and released under an All Rights Reserved license.

See LICENSE for full terms.