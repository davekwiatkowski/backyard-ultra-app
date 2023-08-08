import { Divider, Progress, Space, Typography } from 'antd';
import { useContext, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { msToTime } from '../util/timeUtil';
import RaceContext from '../store/RaceContext';
import Whistle from './Whistle';

const { Text } = Typography;

const ActiveRace = () => {
  const { startTime, elapsedMs, setElapsedMs } = useContext(RaceContext);

  const elapsedTimeInfo = useMemo(() => {
    return msToTime(elapsedMs);
  }, [elapsedMs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMs(dayjs().valueOf() - startTime.valueOf());
    }, 1000);
    return () => clearInterval(interval);
  }, [setElapsedMs, startTime]);

  const displayRemainingTime = useMemo(() => {
    if (elapsedMs < 0) {
      return '';
    }

    let displayMinutes = (60 - (Math.ceil(elapsedTimeInfo.minutes) % 60)) % 60;
    let displaySeconds = (60 - ((elapsedTimeInfo.seconds | 0) % 60)) % 61;
    if (displaySeconds === 60) {
      displaySeconds = 0;
      displayMinutes += 1;
    }
    return `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds
      .toString()
      .padStart(2, '0')}`;
  }, [elapsedMs, elapsedTimeInfo.minutes, elapsedTimeInfo.seconds]);

  const displayElapsedTime = useMemo(() => {
    const displayHours = elapsedTimeInfo.hours | 0;
    const displayMinutes = (elapsedTimeInfo.minutes % 60 | 0)
      .toString()
      .padStart(2, '0');
    const displaySeconds = (elapsedTimeInfo.seconds % 60 | 0)
      .toString()
      .padStart(2, '0');
    return `${displayHours}:${displayMinutes}:${displaySeconds}`;
  }, [elapsedTimeInfo.hours, elapsedTimeInfo.minutes, elapsedTimeInfo.seconds]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <Text style={{ fontSize: '2rem' }}>
        Yard {(elapsedTimeInfo.hours + 1) | 0}
      </Text>
      <Space align='baseline'>
        Elapsed time:
        <Text style={{ fontFamily: 'monospace' }}>{displayElapsedTime}</Text>
      </Space>
      <Divider />
      <Text type='secondary'>Yard progress</Text>
      <Progress
        showInfo={false}
        percent={((elapsedTimeInfo.minutes / 60) * 100) % 100}></Progress>
      <Divider />
      <Space direction='vertical' align='center'>
        <Text type='secondary'>Remaining time in yard</Text>
        <Progress
          type='dashboard'
          percent={
            elapsedMs < 0
              ? 0
              : 100 - (((elapsedMs / 1000 / 60 / 60) * 100) % 100)
          }
          format={() => (
            <Text style={{ fontFamily: 'monospace', fontSize: '1.5rem' }}>
              {displayRemainingTime}
            </Text>
          )}
        />
        <Whistle />
      </Space>
    </div>
  );
};

export default ActiveRace;
