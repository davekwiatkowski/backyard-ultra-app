import { Button } from 'antd';
import { useCallback, useContext } from 'react';
import RaceContext from '../store/RaceContext';
import RaceState from '../constants/RaceState';

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
      }}>
      <Button onClick={handleStartRace} type='primary'>
        Start the race
      </Button>
    </div>
  );
};

export default RaceLanding;
