import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import StorageKeys from '../constants/StorageKeys';

interface ISettingsContext {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (value: boolean) => void;
}

const defaultSettingsContext: ISettingsContext = {
  isSoundEnabled: true,
  setIsSoundEnabled: () => {},
};

const SettingsContext = createContext(defaultSettingsContext);

export const SettingsContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(
    defaultSettingsContext.isSoundEnabled
  );

  const handleSoundEnabledChange = useCallback((value: boolean) => {
    setIsSoundEnabled(value);
    localStorage.setItem(
      StorageKeys.settings,
      JSON.stringify({ isSoundEnabled: value })
    );
  }, []);

  useEffect(() => {
    const cachedSettings = localStorage.getItem(StorageKeys.settings);
    if (!cachedSettings) {
      return;
    }

    try {
      const settings = JSON.parse(cachedSettings);
      if (settings.isSoundEnabled !== undefined) {
        setIsSoundEnabled(settings.isSoundEnabled);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{ isSoundEnabled, setIsSoundEnabled: handleSoundEnabledChange }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
