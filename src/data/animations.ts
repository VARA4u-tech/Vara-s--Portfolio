export const ANIMATION_CONFIG = {
  particleAssembly: {
    particleCount: 90,
    assembleDurationMs: 1300,
    fadeDurationMs: 220,
    spread: 200,
  },
  matrixRain: {
    mobile: { cols: 24, fps: 24, fontSize: 12 },
    tablet: { cols: 32, fps: 24, fontSize: 13 },
    desktop: { cols: 0, fps: 33, fontSize: 14 }, // cols: 0 means auto
  },
  typewriter: {
    typingSpeedMs: 80,
    deletingSpeedMs: 40,
    pauseDurationMs: 2000,
    cursorBlinkRateMs: 530,
  }
};
