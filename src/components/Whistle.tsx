import { SoundOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import useSound from 'use-sound';
import whistle1Sound from '../sounds/whistle1.m4a';
import whistle2Sound from '../sounds/whistle2.m4a';
import whistle3Sound from '../sounds/whistle3.m4a';
import cowbellSound from '../sounds/cowbell.m4a';
import RaceContext from '../store/RaceContext';

const Whistle = () => {
  const { elapsedMs } = useContext(RaceContext);
  const [playWhistle1] = useSound(whistle1Sound);
  const [playWhistle2] = useSound(whistle2Sound);
  const [playWhistle3] = useSound(whistle3Sound);
  const [playCowbell] = useSound(cowbellSound);

  const [isWhistleEnabled, setIsWhistleEnabled] = useState(true);

  const handleClick = useCallback(() => {
    message.info(isWhistleEnabled ? 'Disabled sound' : 'Enabled sound');
    setIsWhistleEnabled(!isWhistleEnabled);
  }, [isWhistleEnabled]);

  useEffect(() => {
    if (isWhistleEnabled) {
      const remainingMinutes =
        (60 * 60 - Math.floor((elapsedMs / 1000) % (60 * 60))) / 60;
      if (remainingMinutes === 3) {
        playWhistle3();
      } else if (remainingMinutes === 2) {
        playWhistle2();
      } else if (remainingMinutes === 1) {
        playWhistle1();
      } else if (remainingMinutes === 60) {
        playCowbell();
      }
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
      type={isWhistleEnabled ? 'primary' : 'default'}
      size='large'
      onClick={handleClick}>
      <SoundOutlined />
      {isWhistleEnabled ? 'On' : 'Off'}
    </Button>
  );
};

export default Whistle;
