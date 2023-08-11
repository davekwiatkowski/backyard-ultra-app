import useSound from 'use-sound';
import whistle1Sound from '../resources/sounds/whistle1.m4a';
import whistle2Sound from '../resources/sounds/whistle2.m4a';
import whistle3Sound from '../resources/sounds/whistle3.m4a';
import cowbellSound from '../resources/sounds/cowbell.m4a';
import { useMemo } from 'react';

const useAlertSounds = () => {
  const [playWhistle1] = useSound(whistle1Sound);
  const [playWhistle2] = useSound(whistle2Sound);
  const [playWhistle3] = useSound(whistle3Sound);
  const [playCowbell] = useSound(cowbellSound);

  return useMemo(
    () => ({
      playWhistle1,
      playWhistle2,
      playWhistle3,
      playCowbell,
    }),
    [playCowbell, playWhistle1, playWhistle2, playWhistle3]
  );
};

export default useAlertSounds;
