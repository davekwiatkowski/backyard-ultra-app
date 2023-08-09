import { BackwardOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useCallback, useContext } from 'react';
import RaceContext from '../store/RaceContext';
import RaceState from '../constants/RaceState';

const RaceSetupBackButton = () => {
  const { raceState, setRaceState } = useContext(RaceContext);

  const handleClick = useCallback(() => {
    if (raceState === RaceState.Configuring) {
      setRaceState(RaceState.Landing);
    } else if (raceState === RaceState.Waiting) {
      setRaceState(RaceState.Configuring);
    }
  }, [raceState, setRaceState]);

  return (
    <Button type='text' onClick={handleClick}>
      <BackwardOutlined /> Back
    </Button>
  );
};

export default RaceSetupBackButton;
