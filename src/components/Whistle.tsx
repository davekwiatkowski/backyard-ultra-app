import { SoundOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useCallback, useContext } from 'react';
import RaceContext from '../store/RaceContext';

const Whistle = () => {
  const { shouldPlayNextAlert, setShouldPlayNextAlert } =
    useContext(RaceContext);

  const handleClick = useCallback(() => {
    message.info(
      shouldPlayNextAlert ? 'Skipped next alert sound' : 'Enabled alert sounds'
    );
    setShouldPlayNextAlert(!shouldPlayNextAlert);
  }, [setShouldPlayNextAlert, shouldPlayNextAlert]);

  return (
    <Button
      shape='round'
      danger={!shouldPlayNextAlert}
      type={'default'}
      size='large'
      onClick={handleClick}>
      {shouldPlayNextAlert ? 'Skip next alert' : 'Next alert skipped'}
      <SoundOutlined />
    </Button>
  );
};

export default Whistle;
