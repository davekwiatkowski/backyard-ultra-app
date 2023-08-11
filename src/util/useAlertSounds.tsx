import useSound from 'use-sound';
import whistle1Sound from '../resources/sounds/whistle1.m4a';
import whistle2Sound from '../resources/sounds/whistle2.m4a';
import whistle3Sound from '../resources/sounds/whistle3.m4a';
import cowbellSound from '../resources/sounds/cowbell.m4a';
import RaceContext from '../store/RaceContext';
import { useContext, useEffect } from 'react';
import SettingsContext from '../store/SettingsContext';

const useAlertSounds = () => {
  const { elapsedMs, shouldPlayNextAlert, setShouldPlayNextAlert } =
    useContext(RaceContext);
  const { isSoundEnabled } = useContext(SettingsContext);
  const [playWhistle1] = useSound(whistle1Sound);
  const [playWhistle2] = useSound(whistle2Sound);
  const [playWhistle3] = useSound(whistle3Sound);
  const [playCowbell] = useSound(cowbellSound);

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

export default useAlertSounds;
