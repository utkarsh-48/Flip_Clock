export function playSoundPattern(type = "soft") {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const patterns = {
    timerDone: [
      { frequency: 784, start: 0, duration: 0.16 },
      { frequency: 988, start: 0.2, duration: 0.18 },
      { frequency: 1175, start: 0.44, duration: 0.28 },
    ],
    breakStart: [
      { frequency: 660, start: 0, duration: 0.18 },
      { frequency: 880, start: 0.22, duration: 0.34 },
    ],
    workStart: [
      { frequency: 988, start: 0, duration: 0.12 },
      { frequency: 784, start: 0.16, duration: 0.12 },
      { frequency: 988, start: 0.32, duration: 0.22 },
    ],
    longBreakStart: [
      { frequency: 523, start: 0, duration: 0.22 },
      { frequency: 659, start: 0.26, duration: 0.22 },
      { frequency: 784, start: 0.52, duration: 0.42 },
    ],
    soft: [{ frequency: 440, start: 0, duration: 0.22 }],
  };

  const notes = patterns[type] || patterns.soft;

  notes.forEach((note) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = context.currentTime + note.start;
    const noteEnd = noteStart + note.duration;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(note.frequency, noteStart);
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
    oscillator.start(noteStart);
    oscillator.stop(noteEnd + 0.03);
  });

  const lastNote = notes.reduce(
    (latest, note) => Math.max(latest, note.start + note.duration),
    0,
  );
  window.setTimeout(() => context.close(), (lastNote + 0.25) * 1000);
}
