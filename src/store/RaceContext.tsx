import dayjs, { Dayjs } from 'dayjs';
import { FC, ReactNode, createContext, useEffect, useState } from 'react';
import RaceState from '../constants/RaceState';

interface IRaceContext {
  startTime: Dayjs;
  setStartTime: (value: Dayjs) => void;
  raceState: RaceState;
  setRaceState: (value: RaceState) => void;
  elapsedMs: number;
  setElapsedMs: (value: number) => void;
}

const defaultRaceContext: IRaceContext = {
  startTime: dayjs().add(999999999),
  setStartTime: () => {},
  raceState: RaceState.Landing,
  setRaceState: () => {},
  elapsedMs: 0,
  setElapsedMs: () => {},
};

const RaceContext = createContext<IRaceContext>(defaultRaceContext);

export const RaceContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [startTime, setStartTime] = useState(defaultRaceContext.startTime);
  const [raceState, setRaceState] = useState(defaultRaceContext.raceState);
  const [elapsedMs, setElapsedMs] = useState(defaultRaceContext.elapsedMs);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime.valueOf() <= dayjs().valueOf()) {
        setRaceState(RaceState.Started);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <RaceContext.Provider
      value={{
        startTime,
        setStartTime,
        raceState,
        setRaceState,
        elapsedMs,
        setElapsedMs,
      }}>
      {children}
    </RaceContext.Provider>
  );
};

export default RaceContext;
