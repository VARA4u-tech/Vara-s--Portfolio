import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type SiteTheme = 'default' | 'halloween' | 'comic';

export interface ThemeContextType {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  cycleTheme: () => void;
  toggleHalloween: () => void;
  toggleComic: () => void;
  isHalloween: boolean;
  isComic: boolean;
  isDefault: boolean;
  prefersReducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => undefined,
  cycleTheme: () => undefined,
  toggleHalloween: () => undefined,
  toggleComic: () => undefined,
  isHalloween: false,
  isComic: false,
  isDefault: true,
  prefersReducedMotion: false,
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<SiteTheme>(() => {
    if (typeof window === 'undefined') return 'comic';
    try {
      const savedTheme = localStorage.getItem('site_theme') as SiteTheme | null;
      if (savedTheme === 'default' || savedTheme === 'halloween' || savedTheme === 'comic') {
        return savedTheme;
      }
      const savedHw = localStorage.getItem('site_halloween_enabled');
      if (savedHw === 'true') {
        return 'halloween';
      }
    } catch {
      // safe fallback
    }
    return 'comic';
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    // Sync theme data attribute on html root for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (nextTheme: SiteTheme) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem('site_theme', nextTheme);
      localStorage.setItem('site_halloween_enabled', String(nextTheme === 'halloween'));
      document.documentElement.setAttribute('data-theme', nextTheme);
    } catch {
      // safe fallback
    }
  };

  const cycleTheme = () => {
    const sequence: SiteTheme[] = ['default', 'comic', 'halloween'];
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
  };

  const toggleHalloween = () => {
    setTheme(theme === 'halloween' ? 'default' : 'halloween');
  };

  const toggleComic = () => {
    setTheme(theme === 'comic' ? 'default' : 'comic');
  };

  const isHalloween = theme === 'halloween';
  const isComic = theme === 'comic';
  const isDefault = theme === 'default';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        cycleTheme,
        toggleHalloween,
        toggleComic,
        isHalloween,
        isComic,
        isDefault,
        prefersReducedMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

/** Backward-compatible hook for components using useHalloween */
export const useHalloween = () => {
  const { isHalloween, toggleHalloween, prefersReducedMotion } = useTheme();
  return { isHalloween, toggleHalloween, prefersReducedMotion };
};

/** Dedicated hook for comic theme */
export const useComic = () => {
  const { isComic, toggleComic, prefersReducedMotion, theme, setTheme } = useTheme();
  return { isComic, toggleComic, prefersReducedMotion, theme, setTheme };
};
