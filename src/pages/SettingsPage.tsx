import { Divider, Layout, Space, Typography } from 'antd';
import EndRaceButton from '../components/EndRaceButton';
import { Content, Footer } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { useContext } from 'react';
import RaceContext from '../store/RaceContext';
import RaceState from '../constants/RaceState';

const { Text, Title } = Typography;

const SettingsPage = () => {
  const { startTime, raceState } = useContext(RaceContext);

  return (
    <Layout style={{ height: '100%' }}>
      <Content>
        {(raceState === RaceState.Started ||
          raceState === RaceState.Initialized) && (
          <>
            <Title level={2}>Info</Title>
            <Title level={5}>Race start time</Title>
            <Text type='secondary'>
              {new Date(startTime.valueOf()).toLocaleString()}
            </Text>
            <Divider />
            <EndRaceButton />
          </>
        )}
      </Content>
      <Footer>
        <Text type='secondary'>"Stroller" © {dayjs().year().toString()}</Text>
      </Footer>
    </Layout>
  );
};

export default SettingsPage;
