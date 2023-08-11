import {
  Button,
  Descriptions,
  Divider,
  Layout,
  Space,
  Switch,
  Table,
} from 'antd';
import EndRaceButton from '../components/EndRaceButton';
import { Content } from 'antd/es/layout/layout';
import { useContext, useMemo } from 'react';
import RaceContext from '../store/RaceContext';
import RaceState from '../constants/RaceState';
import SettingsContext from '../store/SettingsContext';
import useAlertSounds from '../util/useAlertSounds';
import { SoundOutlined } from '@ant-design/icons';
import Column from 'antd/es/table/Column';

const SettingsPage = () => {
  const { startTime, raceState } = useContext(RaceContext);
  const { isSoundEnabled, setIsSoundEnabled } = useContext(SettingsContext);
  const { playWhistle3, playWhistle2, playWhistle1, playCowbell } =
    useAlertSounds();

  const soundData = useMemo(
    () => [
      {
        key: '3whistle',
        name: '3 minute warning',
        test: () => playWhistle3(),
      },
      {
        key: '2whistle',
        name: '2 minute warning',
        test: () => playWhistle2(),
      },
      {
        key: '1whistle',
        name: '1 minute warning',
        test: () => playWhistle1(),
      },
      {
        key: 'cowbell',
        name: 'Start of yard',
        test: () => playCowbell(),
      },
    ],
    [playCowbell, playWhistle1, playWhistle2, playWhistle3]
  );

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
        <Descriptions title='Sounds'>
          <Descriptions.Item label='Sound'>
            <Space>
              <Switch checked={isSoundEnabled} onChange={setIsSoundEnabled} />
              {isSoundEnabled ? 'On' : 'Off'}
            </Space>
          </Descriptions.Item>
        </Descriptions>
        <Table dataSource={soundData} pagination={false}>
          <Column title='Name' dataIndex='name' key='name' />
          <Column
            title='Test'
            dataIndex='test'
            key='test'
            render={(test) => (
              <Button shape='round' disabled={!isSoundEnabled} onClick={test}>
                Test <SoundOutlined />
              </Button>
            )}
          />
        </Table>
        <Divider />
        <EndRaceButton />
      </Content>
    </Layout>
  );
};

export default SettingsPage;
