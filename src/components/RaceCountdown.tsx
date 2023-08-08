import { Space, Spin, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { msToTime } from '../util/timeUtil';
import RaceContext from '../store/RaceContext';

const { Text } = Typography;

const RaceCountdown = () => {
  const { startTime } = useContext(RaceContext);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const { hours, minutes, seconds } = msToTime(
        startTime.valueOf() - dayjs().valueOf()
      );
      setTimeRemaining({
        hours: hours % 60 | 0,
        minutes: minutes % 60 | 0,
        seconds: seconds % 60 | 0,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [setTimeRemaining, startTime]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Space direction='vertical' align='center'>
        <Spin size='large'></Spin>
        <Text>
          Race start: {new Date(startTime.toString()).toLocaleDateString()} at{' '}
          {new Date(startTime.toString()).toLocaleTimeString()}
        </Text>
        <Text>
          Race starts in {timeRemaining.hours} hours, {timeRemaining.minutes}{' '}
          minutes, {timeRemaining.seconds} seconds{' '}
        </Text>
      </Space>
    </div>
  );
};

export default RaceCountdown;
