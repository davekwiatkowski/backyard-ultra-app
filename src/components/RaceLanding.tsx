import { Button, Space, Typography } from 'antd';
import { useCallback, useContext } from 'react';
import RaceContext from '../store/RaceContext';
import RaceState from '../constants/RaceState';

const { Text } = Typography;

const RaceLanding = () => {
  const { setRaceState } = useContext(RaceContext);

  const handleStartRace = useCallback(() => {
    setRaceState(RaceState.Configuring);
  }, [setRaceState]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
      }}>
      <Space direction='vertical' align='center'>
        <Text>No race is active. Do you want to setup the race?</Text>
        <Button onClick={handleStartRace} type='primary' shape='round'>
          Setup
        </Button>
      </Space>
    </div>
  );
};

export default RaceLanding;
