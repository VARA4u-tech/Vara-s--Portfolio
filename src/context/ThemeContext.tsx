import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

export type SiteTheme = 'default' | 'halloween' | 'comic';

export const DEFAULT_THEME: SiteTheme = 'default';
export const THEME_STORAGE_KEY = 'site_theme';
export const LEGACY_HALLOWEEN_KEY = 'site_halloween_enabled';

const VALID_THEMES: ReadonlySet<string> = new Set<SiteTheme>([
  'default',
  'halloween',
  'comic',
]);

/**
 * Resolves the initial theme from localStorage, falling back to Classic Theme ('default')
 * for first-time visitors or invalid/outdated stored values.
 */
export const resolveInitialTheme = (): SiteTheme => {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  let resolved: SiteTheme = DEFAULT_THEME;
  try {
    const rawTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (rawTheme !== null) {
      const normalized = rawTheme.trim().toLowerCase();
      if (VALID_THEMES.has(normalized)) {
        resolved = normalized as SiteTheme;
      } else {
        // Clear invalid/outdated keys so fallback stays consistent on future loads
        window.localStorage.removeItem(THEME_STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_HALLOWEEN_KEY);
      }
    } else if (window.localStorage.getItem(LEGACY_HALLOWEEN_KEY) === 'true') {
      resolved = 'halloween';
    }
  } catch {
    resolved = DEFAULT_THEME;
  }

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', resolved);
  }
  return resolved;
};

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
  theme: DEFAULT_THEME,
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
  const [theme, setThemeState] = useState<SiteTheme>(resolveInitialTheme);

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

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    // Sync theme data attribute on html root for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keep theme in sync across browser tabs when localStorage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === THEME_STORAGE_KEY ||
        e.key === LEGACY_HALLOWEEN_KEY ||
        e.key === null
      ) {
        setThemeState(resolveInitialTheme());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = useCallback((nextTheme: SiteTheme) => {
    const safeTheme = VALID_THEMES.has(nextTheme) ? nextTheme : DEFAULT_THEME;
    setThemeState(safeTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
      window.localStorage.setItem(
        LEGACY_HALLOWEEN_KEY,
        String(safeTheme === 'halloween'),
      );
      document.documentElement.setAttribute('data-theme', safeTheme);
    } catch {
      // safe fallback when storage is unavailable
    }
  }, []);

  const cycleTheme = useCallback(() => {
    const sequence: SiteTheme[] = ['default', 'comic', 'halloween'];
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const toggleHalloween = useCallback(() => {
    setTheme(theme === 'halloween' ? 'default' : 'halloween');
  }, [theme, setTheme]);

  const toggleComic = useCallback(() => {
    setTheme(theme === 'comic' ? 'default' : 'comic');
  }, [theme, setTheme]);

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
  const { isComic, toggleComic, prefersReducedMotion, theme, setTheme } =
    useTheme();
  return { isComic, toggleComic, prefersReducedMotion, theme, setTheme };
};
