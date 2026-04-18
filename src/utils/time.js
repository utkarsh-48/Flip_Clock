export function pad(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

export function splitDigits(totalSeconds) {
  const safeTotal = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeTotal / 3600);
  const minutes = Math.floor((safeTotal % 3600) / 60);
  const seconds = safeTotal % 60;
  return `${pad(hours)}${pad(minutes)}${pad(seconds)}`.slice(-6).split("");
}

export function getClockDigits(isTwentyFourHour) {
  const now = new Date();
  let hours = now.getHours();
  if (!isTwentyFourHour) {
    hours = hours % 12 || 12;
  }
  return `${pad(hours)}${pad(now.getMinutes())}${pad(now.getSeconds())}`.split(
    "",
  );
}

export function getClockPeriod() {
  return new Date().getHours() >= 12 ? "PM" : "AM";
}

export function getDateLabel() {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());
}
