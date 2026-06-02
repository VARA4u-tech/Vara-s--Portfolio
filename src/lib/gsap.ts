/**
 * Central GSAP configuration
 * - Registers ScrollTrigger and TextPlugin (both free with gsap npm)
 * - Sets sensible global defaults
 * - Respects prefers-reduced-motion
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register free plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global defaults — match the neo-brutalist feel of the portfolio
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// Respect user's motion preference
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (motionQuery.matches) {
  gsap.globalTimeline.timeScale(100); // effectively skip all animations instantly
}

export { gsap, ScrollTrigger, TextPlugin };
