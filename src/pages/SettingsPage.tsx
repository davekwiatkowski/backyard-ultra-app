import { Descriptions, Divider, Layout, Space, Switch } from 'antd';
import EndRaceButton from '../components/EndRaceButton';
import { Content } from 'antd/es/layout/layout';
import { useContext } from 'react';
import RaceContext from '../store/RaceContext';
import RaceState from '../constants/RaceState';
import SettingsContext from '../store/SettingsContext';

const SettingsPage = () => {
  const { startTime, raceState } = useContext(RaceContext);
  const { isSoundEnabled, setIsSoundEnabled } = useContext(SettingsContext);

  return (
    <Layout style={{ height: '100%' }}>
      <Content>
        {(raceState === RaceState.Active ||
          raceState === RaceState.Configuring) && (
          <>
            <Descriptions title='Info'>
              <Descriptions.Item label='Race start time'>
                {new Date(startTime.valueOf()).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
          </>
        )}
        <Descriptions title='Settings'>
          <Descriptions.Item label='Sound'>
            <Space>
              <Switch checked={isSoundEnabled} onChange={setIsSoundEnabled} />
              {isSoundEnabled ? 'On' : 'Off'}
            </Space>
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <EndRaceButton />
      </Content>
    </Layout>
  );
};

export default SettingsPage;
