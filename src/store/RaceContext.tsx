import dayjs, { Dayjs } from 'dayjs';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import RaceState from '../constants/RaceState';
import { useElapsedTime } from 'use-elapsed-time';

interface IRaceContext {
  startTime: Dayjs;
  setStartTime: (value: Dayjs) => void;
  raceState: RaceState;
  setRaceState: (value: RaceState) => void;
  elapsedMs: number;
  shouldPlayNextAlert: boolean;
  setShouldPlayNextAlert: (value: boolean) => void;
}

const defaultRaceContext: IRaceContext = {
  startTime: dayjs(),
  setStartTime: () => {},
  raceState:
    (localStorage.getItem('raceState') as RaceState) || RaceState.Landing,
  setRaceState: () => {},
  elapsedMs: -999999,
  shouldPlayNextAlert: true,
  setShouldPlayNextAlert: () => {},
};

const RaceContext = createContext<IRaceContext>(defaultRaceContext);

export const RaceContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [startTime, setStartTime] = useState(defaultRaceContext.startTime);
  const [raceState, setRaceState] = useState(defaultRaceContext.raceState);
  const [elapsedMs, setElapsedMs] = useState(defaultRaceContext.elapsedMs);
  const [shouldPlayNextAlert, setShouldPlayNextAlert] = useState(true);
  const { elapsedTime, reset } = useElapsedTime({
    isPlaying: true,
    updateInterval: 1,
  });

  const handleStartTimeChange = useCallback((startTime: Dayjs) => {
    setStartTime(startTime);
    localStorage.setItem('startTime', startTime.toString());
  }, []);

  const handleRaceStateChange = useCallback((raceState: RaceState) => {
    setRaceState(raceState);
    localStorage.setItem('raceState', raceState);
  }, []);

  useEffect(() => {
    const cachedStartTime = localStorage.getItem('startTime');
    if (cachedStartTime) {
      setStartTime(dayjs(cachedStartTime));
    }
    const cachedRaceState = localStorage.getItem('raceState');
    if (cachedRaceState) {
      setRaceState(cachedRaceState as RaceState);
    }
  }, []);

  useEffect(() => {
    reset((dayjs().valueOf() - startTime.valueOf()) / 1000);
  }, [reset, startTime]);

  useEffect(() => {
    setElapsedMs(elapsedTime * 1000);
  }, [elapsedTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        raceState === RaceState.Waiting &&
        startTime.valueOf() <= dayjs().valueOf()
      ) {
        handleRaceStateChange(RaceState.Active);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [handleRaceStateChange, raceState, startTime]);

  return (
    <RaceContext.Provider
      value={{
        startTime,
        setStartTime: handleStartTimeChange,
        raceState,
        setRaceState: handleRaceStateChange,
        elapsedMs,
        shouldPlayNextAlert,
        setShouldPlayNextAlert,
      }}>
      {children}
    </RaceContext.Provider>
  );
};

export default RaceContext;
