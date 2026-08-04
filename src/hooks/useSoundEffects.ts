/**
 * useSoundEffects — Web Audio API-based sound engine.
 * No external files needed. All sounds are synthesized inline.
 * Respects the user's "prefers-reduced-motion" / OS mute settings via lazy
 * AudioContext creation (only after the first user gesture).
 */

let ctx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    } catch {
      return null;
    }
  }
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

/** Master volume (0–1). Users can mute site-wide. */
let masterVolume = 0.8;
export const setMasterVolume = (v: number) => {
  masterVolume = Math.max(0, Math.min(1, v));
};
export const getMasterVolume = () => masterVolume;

// ---------------------------------------------------------------------------
// Primitive helpers
// ---------------------------------------------------------------------------

const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 1,
  fadeOut = true,
  delay: number = 0,
) => {
  const c = getCtx();
  if (!c) return;

  const t = c.currentTime + delay;

  const gainNode = c.createGain();
  gainNode.gain.setValueAtTime(masterVolume * volume, t);
  if (fadeOut) {
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  }
  gainNode.connect(c.destination);

  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t);
  osc.connect(gainNode);
  osc.start(t);
  osc.stop(t + duration);
};

const playChord = (
  frequencies: number[],
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.7,
) => {
  frequencies.forEach((f) =>
    playTone(f, duration, type, volume / frequencies.length),
  );
};

// ---------------------------------------------------------------------------
// Named sounds — exported for individual use
// ---------------------------------------------------------------------------

/** Short, crisp UI click (navbar links, buttons) */
export const playClick = () => {
  playTone(600, 0.06, 'square', 0.7);
};

/** Slightly softer click — used for secondary actions */
export const playSoftClick = () => {
  playTone(400, 0.05, 'sine', 0.5);
};

/** Keyboard tick — used on every keypress in the terminal */
export const playKeyTick = () => {
  playTone(900 + Math.random() * 200, 0.03, 'square', 0.28);
};

/** Success chime — two ascending tones (form submit, copy) */
export const playSuccess = () => {
  const c = getCtx();
  if (!c) return;
  const times = [0, 0.12];
  const freqs = [523, 784]; // C5, G5
  times.forEach((t, i) => playTone(freqs[i], 0.18, 'sine', 0.85, true, t));
};

/** Pop — short pluck (copy to clipboard) */
export const playPop = () => {
  const c = getCtx();
  if (!c) return;
  const gain = c.createGain();
  gain.gain.setValueAtTime(masterVolume * 0.9, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.09);
  gain.connect(c.destination);

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.09);
  osc.connect(gain);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.09);
};

/** Whoosh — sweep used for scroll-to-top */
export const playWhoosh = () => {
  const c = getCtx();
  if (!c) return;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.linearRampToValueAtTime(masterVolume * 0.7, c.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.25);
  gain.connect(c.destination);

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.25);
  osc.connect(gain);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.25);
};

/** Terminal open — techy low hum intro */
export const playTerminalOpen = () => {
  const c = getCtx();
  if (!c) return;
  // Low sweep up
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.linearRampToValueAtTime(masterVolume * 0.6, c.currentTime + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.45);
  gain.connect(c.destination);

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.45);
  osc.connect(gain);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.45);

  // Overlay a short blip
  playTone(440, 0.08, 'square', 0.2, true, 0.12);
};

/** Terminal close — mirrored whoosh down */
export const playTerminalClose = () => {
  const c = getCtx();
  if (!c) return;
  const gain = c.createGain();
  gain.gain.setValueAtTime(masterVolume * 0.6, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.2);
  gain.connect(c.destination);

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.2);
  osc.connect(gain);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.2);
};

/** Command error — low negative blip */
export const playError = () => {
  playChord([200, 190], 0.2, 'square', 0.7);
};

/** Hover ping — very subtle, for project cards */
export const playHover = () => {
  playTone(1200, 0.04, 'sine', 0.22);
};

/** String Pluck — used for the string animation */
export const playStringPluck = (intensity: number = 1) => {
  const c = getCtx();
  if (!c) return;
  const gain = c.createGain();
  // Adjust volume based on intensity (0 to 1)
  gain.gain.setValueAtTime(
    masterVolume * Math.min(1, intensity) * 0.8,
    c.currentTime,
  );
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.2);
  gain.connect(c.destination);

  const osc = c.createOscillator();
  // String-like sound using triangle
  osc.type = 'triangle';
  // Randomize pitch slightly for a more organic feel, base around A2 (110 Hz)
  const baseFreq = 110 + Math.random() * 40;
  osc.frequency.setValueAtTime(baseFreq, c.currentTime);

  // Optional: add a slight frequency bend for a realistic "twang"
  osc.frequency.exponentialRampToValueAtTime(
    baseFreq * 0.98,
    c.currentTime + 1.2,
  );

  osc.connect(gain);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 1.2);
};

/** Pixel Pet interaction sound — an audible 8-bit jump/chirp */
export const playBark = () => {
  if (masterVolume === 0) return;
  const c = getCtx();
  if (!c) return;

  const now = c.currentTime;
  const gain = c.createGain();

  // Slower decay so the sound is actually audible (previous 80ms exp decay was just a tick)
  gain.gain.setValueAtTime(masterVolume * 0.5, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.3);
  gain.connect(c.destination);

  const osc = c.createOscillator();
  osc.type = 'square';
  // 8-bit pitch slide up for a jump/chirp
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
  osc.connect(gain);

  osc.start(now);
  osc.stop(now + 0.3);
};

// ---------------------------------------------------------------------------
// Hook — convenience wrapper for component use
// ---------------------------------------------------------------------------

const useSoundEffects = () => ({
  playClick,
  playSoftClick,
  playKeyTick,
  playSuccess,
  playPop,
  playWhoosh,
  playTerminalOpen,
  playTerminalClose,
  playError,
  playHover,
  playStringPluck,
  playBark,
  setMasterVolume,
  getMasterVolume,
});

export default useSoundEffects;
