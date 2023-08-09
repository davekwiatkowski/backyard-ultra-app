import { Divider, Layout, Space, Typography } from 'antd';
import EndRaceButton from '../components/EndRaceButton';
import { Content } from 'antd/es/layout/layout';
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
          raceState === RaceState.Configuring) && (
          <>
            <Title level={3}>Info</Title>
            <Space align='baseline'>
              <Text>Race start time:</Text>
              <Text type='secondary'>
                {new Date(startTime.valueOf()).toLocaleString()}
              </Text>
            </Space>
            <Divider />
          </>
        )}
        <EndRaceButton />
      </Content>
    </Layout>
  );
};

export default SettingsPage;
