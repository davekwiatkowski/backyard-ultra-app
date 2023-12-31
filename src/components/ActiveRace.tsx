import { Divider, Progress, Space, Statistic, Typography } from 'antd';
import { useCallback, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { msToTime } from '../util/timeUtil';
import RaceContext from '../store/RaceContext';
import AlertButton from './AlertButton';
import { valueType } from 'antd/es/statistic/utils';
import CountUp from 'react-countup';
import SettingsContext from '../store/SettingsContext';

const { Text } = Typography;
const { Countdown } = Statistic;

const statisticFormatter = (value: number) => (
  <CountUp end={value} separator=',' />
);

const ActiveRace = () => {
  const { startTime, elapsedMs } = useContext(RaceContext);
  const { isSoundEnabled } = useContext(SettingsContext);
  const [remainingTime, setRemainingTime] = useState(0);

  const elapsedTimeInfo = useMemo(() => {
    return msToTime(elapsedMs);
  }, [elapsedMs]);

  const handleCountdownChange = useCallback((value?: valueType) => {
    if (typeof value === 'number') {
      setRemainingTime(value);
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Space split={<Divider type='vertical' />}>
        <Statistic
          formatter={statisticFormatter as any}
          title='Current yard'
          value={(elapsedTimeInfo.hours + 1) | 0}
        />
        <Countdown
          title={'Race time'}
          valueStyle={{ fontFamily: 'monospace' }}
          format='H:mm:ss'
          value={
            dayjs().valueOf() + dayjs().subtract(startTime.valueOf()).valueOf()
          }
        />
      </Space>
      <Divider />
      <Text type='secondary'>Yard progress</Text>
      <Progress
        showInfo={false}
        percent={((elapsedTimeInfo.minutes / 60) * 100) % 100}></Progress>
      <Divider />
      <Space direction='vertical' align='center'>
        <Text type='secondary'>Remaining yard time</Text>
        <Progress
          type='dashboard'
          percent={(remainingTime / (1000 * 60 * 60)) * 100}
          format={() => (
            <Countdown
              valueStyle={{ fontFamily: 'monospace' }}
              format='mm:ss'
              onChange={handleCountdownChange}
              value={
                dayjs().valueOf() +
                1000 * 60 * 60 -
                (dayjs().subtract(startTime.valueOf()).valueOf() %
                  (1000 * 60 * 60))
              }
            />
          )}
        />
        {isSoundEnabled && <AlertButton />}
      </Space>
    </div>
  );
};

export default ActiveRace;
