import { Steps } from 'antd';
import { useContext, useEffect, useState } from 'react';
import RaceContext from '../store/RaceContext';
import RaceState from '../constants/RaceState';

const RaceSteps = () => {
  const [current, setCurrent] = useState(0);
  const { raceState } = useContext(RaceContext);

  useEffect(() => {
    if (raceState === RaceState.Configuring) {
      setCurrent(0);
    } else if (raceState === RaceState.Waiting) {
      setCurrent(1);
    }
  }, [raceState]);

  return (
    <>
      <Steps
        direction='horizontal'
        size='small'
        responsive={false}
        current={current}
        items={[
          {
            title: 'Setup',
          },
          { title: 'Wait' },
        ]}
      />
      <br />
    </>
  );
};

export default RaceSteps;
