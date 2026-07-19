export const ANIMATION_CONFIG = {
  particleAssembly: {
    particleCount: 90,
    assembleDurationMs: 1300,
    fadeDurationMs: 220,
    spread: 200,
  },
  matrixRain: {
    mobile: { cols: 36, fps: 24, fontSize: 12 },
    tablet: { cols: 48, fps: 24, fontSize: 13 },
    desktop: { cols: 0, fps: 33, fontSize: 10 }, // cols: 0 means auto (smaller fontSize = more columns)
  },
  typewriter: {
    typingSpeedMs: 80,
    deletingSpeedMs: 40,
    pauseDurationMs: 2000,
    cursorBlinkRateMs: 530,
  },
};
