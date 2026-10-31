import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface HalloweenContextType {
  isHalloween: boolean;
  toggleHalloween: () => void;
  prefersReducedMotion: boolean;
}

const HalloweenContext = createContext<HalloweenContextType>({
  isHalloween: true,
  toggleHalloween: () => undefined,
  prefersReducedMotion: false,
});

export const HalloweenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isHalloween, setIsHalloween] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('site_halloween_enabled');
    // Default to true for Halloween season!
    return saved !== 'false';
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
  );

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    const handleExternalToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (typeof customEvent.detail?.enabled === 'boolean') {
        setIsHalloween(customEvent.detail.enabled);
      }
    };
    window.addEventListener('halloween-toggle', handleExternalToggle);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('halloween-toggle', handleExternalToggle);
    };
  }, []);

  const toggleHalloween = () => {
    const nextState = !isHalloween;
    setIsHalloween(nextState);
    localStorage.setItem('site_halloween_enabled', String(nextState));
    window.dispatchEvent(
      new CustomEvent('halloween-toggle', { detail: { enabled: nextState } }),
    );
  };

  return (
    <HalloweenContext.Provider
      value={{ isHalloween, toggleHalloween, prefersReducedMotion }}
    >
      {children}
    </HalloweenContext.Provider>
  );
};

export const useHalloween = () => useContext(HalloweenContext);
