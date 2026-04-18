export const MODES = ["clock", "stopwatch", "timer", "pomodoro"];

export const ICONS = {
  mode: "/icons/time.png",
  time: "/icons/edit.png",
  font: "/icons/text.png",
  themes: "/icons/background.png",
  settings: "/icons/timer.png",
  clock: "/icons/clock.png",
  stopwatch: "/icons/stopclock.png",
  timer: "/icons/timer.png",
  pomodoro: "/icons/pomodoro.png",
};

export const MODE_ICONS = {
  clock: ICONS.clock,
  stopwatch: ICONS.stopwatch,
  timer: ICONS.timer,
  pomodoro: ICONS.pomodoro,
};

export const FONT_OPTIONS = [
  { label: "Orbitron", value: "Orbitron" },
  { label: "Roboto Mono", value: "Roboto Mono" },
  { label: "Share Tech Mono", value: "Share Tech Mono" },
  { label: "Chakra Petch", value: "Chakra Petch" },
  { label: "Space Mono", value: "Space Mono" },
];

export const DIGIT_COLORS = [
  { id: "white", label: "White", value: "#f7fbff" },
  { id: "amber", label: "Amber", value: "#ffc857" },
  { id: "green", label: "Phosphor", value: "#65ff9a" },
  { id: "red", label: "Red LED", value: "#ff5d5d" },
  { id: "blue", label: "Ice Blue", value: "#7dd7ff" },
  { id: "custom", label: "Custom", value: "#f7fbff" },
];

export const TIMER_PRESETS = [
  { label: "5m", seconds: 5 * 60 },
  { label: "10m", seconds: 10 * 60 },
  { label: "25m", seconds: 25 * 60 },
  { label: "45m", seconds: 45 * 60 },
];

export const THEMES = [
  { id: "default", label: "Default", image: "" },
  {
    id: "nature",
    label: "Nature",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "abstract",
    label: "Abstract",
    image:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "space",
    label: "Space",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "mountain",
    label: "Mountain",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "ocean",
    label: "Ocean",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "custom",
    label: "Custom",
    image: "custom",
  },
  {
    id: "dev-choice",
    label: "Dev's choice",
    image: null,
  },
];

export const STORAGE_KEYS = {
  background: "flip-clock-background",
  backgroundBlur: "flip-clock-background-blur",
  backgroundOverlay: "flip-clock-background-overlay",
  burnInProtection: "flip-clock-burn-in",
  digitColor: "flip-clock-digit-color",
  font: "flip-clock-font",
  showDate: "flip-clock-show-date",
  soundEnabled: "flip-clock-sound-enabled",
};
