import { Button, Popconfirm, message } from 'antd';
import { useCallback, useContext, useMemo } from 'react';
import RaceContext from '../store/RaceContext';
import { useNavigate } from 'react-router';
import RaceState from '../constants/RaceState';

const EndRaceButton = () => {
  const { setRaceState, raceState, setElapsedMs } = useContext(RaceContext);
  const navigate = useNavigate();

  const isDisabled = useMemo(() => {
    return (
      raceState === RaceState.Configuring || raceState === RaceState.Landing
    );
  }, [raceState]);

  const handleEndRace = useCallback(() => {
    setRaceState(RaceState.Landing);
    setElapsedMs(-999999);
    message.success('Ended race.');
    navigate('/race');
  }, [navigate, setElapsedMs, setRaceState]);

  return (
    <Popconfirm
      disabled={isDisabled}
      title='End the race'
      okText='Yes'
      cancelText='No'
      okType='danger'
      description='Are you sure you want to end the race?'
      onConfirm={handleEndRace}>
      <Button disabled={isDisabled} danger>
        End race
      </Button>
    </Popconfirm>
  );
};

export default EndRaceButton;
