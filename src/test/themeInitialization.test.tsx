import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  ThemeProvider,
  useTheme,
  resolveInitialTheme,
  THEME_STORAGE_KEY,
  LEGACY_HALLOWEEN_KEY,
  type SiteTheme,
} from '@/context/ThemeContext';

const ThemeHarness = () => {
  const { theme, isDefault, isComic, isHalloween, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="flags">
        {`${isDefault}-${isComic}-${isHalloween}`}
      </span>
      <button onClick={() => setTheme('comic')}>comic</button>
      <button onClick={() => setTheme('halloween')}>halloween</button>
      <button onClick={() => setTheme('default')}>default</button>
      <button onClick={() => setTheme('invalid' as SiteTheme)}>invalid</button>
    </div>
  );
};

describe('Theme initialization and persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults first-time visitors to Classic Theme without pre-writing localStorage', () => {
    expect(resolveInitialTheme()).toBe('default');
    expect(document.documentElement.getAttribute('data-theme')).toBe('default');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('restores saved valid theme preferences for returning visitors', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'comic');
    expect(resolveInitialTheme()).toBe('comic');
    expect(document.documentElement.getAttribute('data-theme')).toBe('comic');

    window.localStorage.setItem(THEME_STORAGE_KEY, 'halloween');
    expect(resolveInitialTheme()).toBe('halloween');
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'halloween',
    );
  });

  it('migrates legacy site_halloween_enabled=true only when site_theme is unset', () => {
    window.localStorage.setItem(LEGACY_HALLOWEEN_KEY, 'true');
    expect(resolveInitialTheme()).toBe('halloween');
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'halloween',
    );
  });

  it('falls back cleanly to Classic Theme on invalid or outdated localStorage values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon-legacy-v1');
    window.localStorage.setItem(LEGACY_HALLOWEEN_KEY, 'true');

    expect(resolveInitialTheme()).toBe('default');
    expect(document.documentElement.getAttribute('data-theme')).toBe('default');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(LEGACY_HALLOWEEN_KEY)).toBeNull();
  });

  it('renders Classic Theme initially and persists subsequent manual switches', () => {
    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('default');
    expect(screen.getByTestId('flags')).toHaveTextContent('true-false-false');

    act(() => {
      screen.getByText('comic').click();
    });
    expect(screen.getByTestId('theme')).toHaveTextContent('comic');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('comic');
    expect(document.documentElement.getAttribute('data-theme')).toBe('comic');

    act(() => {
      screen.getByText('halloween').click();
    });
    expect(screen.getByTestId('theme')).toHaveTextContent('halloween');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('halloween');
    expect(window.localStorage.getItem(LEGACY_HALLOWEEN_KEY)).toBe('true');

    act(() => {
      screen.getByText('invalid').click();
    });
    expect(screen.getByTestId('theme')).toHaveTextContent('default');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('default');
  });
});
