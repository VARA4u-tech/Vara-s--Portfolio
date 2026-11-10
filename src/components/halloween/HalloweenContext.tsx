import React, { ReactNode } from 'react';
import {
  ThemeProvider,
  useTheme,
  useHalloween as useThemeHalloween,
  useComic,
} from '@/context/ThemeContext';

export const HalloweenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export const useHalloween = useThemeHalloween;
export { useTheme, useComic };
export default HalloweenProvider;
