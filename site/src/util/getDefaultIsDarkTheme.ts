import { StorageKeyConstants } from '../constants/StorageKeyConstants';
import { PREFERS_DARK_THEME_MEDIA_QUERY } from '../constants/ThemeConstants';
import { defaultThemeContext } from '../context/ThemeContext';

export const getDefaultIsDarkTheme = (): boolean => {
  const localStorageIsDarkTheme = localStorage.getItem(StorageKeyConstants.IS_DARK_THEME);
  const isDarkThemePreferred = window.matchMedia(PREFERS_DARK_THEME_MEDIA_QUERY).matches;
  if (localStorageIsDarkTheme) {
    return JSON.parse(localStorageIsDarkTheme) as boolean;
  }
  if (isDarkThemePreferred) {
    return true;
  }
  return defaultThemeContext.isDarkTheme;
};
