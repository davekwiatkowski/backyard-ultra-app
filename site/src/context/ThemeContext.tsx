'use client';

import React, { FC, createContext, useCallback, useEffect, useState } from 'react';
import { PREFERS_DARK_THEME_MEDIA_QUERY, Theme } from '../constants/ThemeConstants';
import { StorageKeyConstants } from '../constants/StorageKeyConstants';
import { getDefaultIsDarkTheme } from '../util/getDefaultIsDarkTheme';

interface IThemeContext {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
}

export const defaultThemeContext: IThemeContext = {
  isDarkTheme: false,
  setIsDarkTheme: () => {},
};

export const ThemeContext = createContext<IThemeContext>(defaultThemeContext);

export const ThemeContextProvider: FC<{ children: React.JSX.Element | React.JSX.Element[] }> = ({
  children,
}) => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(defaultThemeContext.isDarkTheme);

  const handleDarkThemeChange = useCallback((isDarkTheme: boolean) => {
    localStorage.setItem(StorageKeyConstants.IS_DARK_THEME, `${isDarkTheme}`);
    setIsDarkTheme(isDarkTheme);
  }, []);

  useEffect(() => {
    document
      .querySelector('html')
      ?.setAttribute('data-theme', isDarkTheme ? Theme.DARK : Theme.LIGHT);
  }, [isDarkTheme]);

  useEffect(() => {
    setIsDarkTheme(getDefaultIsDarkTheme());

    const handleIsDarkThemePreferredChange = (event: MediaQueryListEvent) => {
      setIsDarkTheme(event.matches);
    };
    window
      .matchMedia(PREFERS_DARK_THEME_MEDIA_QUERY)
      .addEventListener('change', handleIsDarkThemePreferredChange);
    return () => {
      window
        .matchMedia(PREFERS_DARK_THEME_MEDIA_QUERY)
        .removeEventListener('change', handleIsDarkThemePreferredChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, setIsDarkTheme: handleDarkThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};
