import { SoundOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import useSound from 'use-sound';
import whistle1Sound from '../resources/sounds/whistle1.m4a';
import whistle2Sound from '../resources/sounds/whistle2.m4a';
import whistle3Sound from '../resources/sounds/whistle3.m4a';
import cowbellSound from '../resources/sounds/cowbell.m4a';
import RaceContext from '../store/RaceContext';

const Whistle = () => {
  const { elapsedMs } = useContext(RaceContext);
  const [playWhistle1] = useSound(whistle1Sound);
  const [playWhistle2] = useSound(whistle2Sound);
  const [playWhistle3] = useSound(whistle3Sound);
  const [playCowbell] = useSound(cowbellSound);

  const [isWhistleEnabled, setIsWhistleEnabled] = useState(true);

  const handleClick = useCallback(() => {
    message.info(
      isWhistleEnabled ? 'Skipped next alert sound' : 'Enabled alert sounds'
    );
    setIsWhistleEnabled(!isWhistleEnabled);
  }, [isWhistleEnabled]);

  useEffect(() => {
    if (elapsedMs < 0) {
      return;
    }

    const remainingMinutes =
      (60 * 60 - Math.floor((elapsedMs / 1000) % (60 * 60))) / 60;
    if (isWhistleEnabled) {
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
      setIsWhistleEnabled(true);
    }
  }, [
    elapsedMs,
    isWhistleEnabled,
    playCowbell,
    playWhistle1,
    playWhistle2,
    playWhistle3,
  ]);

  return (
    <Button
      shape='round'
      danger={!isWhistleEnabled}
      type={'default'}
      size='large'
      onClick={handleClick}>
      {isWhistleEnabled ? 'Skip next alert' : 'Next alert skipped'}
      <SoundOutlined />
    </Button>
  );
};

export default Whistle;
