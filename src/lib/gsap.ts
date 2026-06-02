/**
 * Central GSAP configuration
 * - Registers ScrollTrigger and TextPlugin (both free with gsap npm)
 * - Sets sensible global defaults
 * - Respects prefers-reduced-motion
 * - Mobile/tablet safe: handles orientation change & touch scroll
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register free plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global defaults — tuned for the neo-brutalist portfolio feel
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// ScrollTrigger global config for mobile/tablet smoothness
ScrollTrigger.config({
  // Avoids the 300ms tap delay on iOS by using pointer events
  ignoreMobileResize: true,
  // Recalculate all trigger positions after fonts/images load
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
});

// Recalculate all ScrollTrigger positions on orientation change
// (e.g., portrait ↔ landscape on phone/tablet)
window.addEventListener('orientationchange', () => {
  setTimeout(() => ScrollTrigger.refresh(), 200);
});

// Respect user's motion preference
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (motionQuery.matches) {
  gsap.globalTimeline.timeScale(100); // effectively skip all animations instantly
}

export { gsap, ScrollTrigger, TextPlugin };
