import { useState, useEffect } from 'react';
import { ANIMATION_CONFIG } from '@/data/animations';

export const useTypewriter = (roles: string[]) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, ANIMATION_CONFIG.typewriter.cursorBlinkRateMs);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!roles || roles.length === 0) return;

    const currentRole = roles[roleIndex];
    const { typingSpeedMs, deletingSpeedMs, pauseDurationMs } =
      ANIMATION_CONFIG.typewriter;
    const typeSpeed = isDeleting ? deletingSpeedMs : typingSpeedMs;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
        if (displayText.length === currentRole.length) {
          setTimeout(() => setIsDeleting(true), pauseDurationMs);
        }
      } else {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, roles]);

  return { displayText, cursorVisible };
};
