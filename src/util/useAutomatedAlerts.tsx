import RaceContext from '../store/RaceContext';
import { useContext, useEffect } from 'react';
import SettingsContext from '../store/SettingsContext';
import useAlertSounds from './useAlertSounds';

const useAutomatedAlerts = () => {
  const { elapsedMs, shouldPlayNextAlert, setShouldPlayNextAlert } =
    useContext(RaceContext);
  const { isSoundEnabled } = useContext(SettingsContext);
  const { playWhistle1, playWhistle2, playWhistle3, playCowbell } =
    useAlertSounds();

  useEffect(() => {
    if (elapsedMs < 0 || !isSoundEnabled) {
      return;
    }

    const remainingMinutes =
      (60 * 60 - Math.floor((elapsedMs / 1000) % (60 * 60))) / 60;
    if (shouldPlayNextAlert) {
      if (remainingMinutes === 3) {
        playWhistle3();
        console.debug('playing 3 whistles');
      } else if (remainingMinutes === 2) {
        playWhistle2();
        console.debug('playing 2 whistles');
      } else if (remainingMinutes === 1) {
        playWhistle1();
        console.debug('playing 1 whistle');
      } else if (remainingMinutes === 60) {
        playCowbell();
        console.debug('playing cowbell');
      }
    }
    if (
      remainingMinutes === 3 - 1 / 60 ||
      remainingMinutes === 2 - 1 / 60 ||
      remainingMinutes === 1 - 1 / 60 ||
      remainingMinutes === 60 - 1 / 60
    ) {
      setShouldPlayNextAlert(true);
    }
  }, [
    elapsedMs,
    isSoundEnabled,
    playCowbell,
    playWhistle1,
    playWhistle2,
    playWhistle3,
    setShouldPlayNextAlert,
    shouldPlayNextAlert,
  ]);
};

export default useAutomatedAlerts;
