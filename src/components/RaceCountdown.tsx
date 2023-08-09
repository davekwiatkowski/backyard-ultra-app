import { Space, Statistic, Typography } from 'antd';
import { useContext } from 'react';
import RaceContext from '../store/RaceContext';

const { Text, Title } = Typography;
const { Countdown } = Statistic;

const RaceCountdown = () => {
  const { startTime } = useContext(RaceContext);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Space direction='vertical'>
        <Title level={2}>Wait for the race to begin</Title>
        <Space>
          <Text type='secondary'>Race start:</Text>
          <Text>
            {new Date(startTime.toString()).toLocaleDateString()} at{' '}
            {new Date(startTime.toString()).toLocaleTimeString()}
          </Text>
        </Space>
        <Countdown
          valueStyle={{ fontFamily: 'monospace' }}
          title='Time remaining for race to start'
          value={startTime.valueOf()}
          format='H:mm:ss'
        />
      </Space>
    </div>
  );
};

export default RaceCountdown;
