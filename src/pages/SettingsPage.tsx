import { Layout, Typography } from 'antd';
import EndRaceButton from '../components/EndRaceButton';
import { Content, Footer } from 'antd/es/layout/layout';
import dayjs from 'dayjs';

const { Text } = Typography;

const SettingsPage = () => {
  return (
    <Layout style={{ height: '100%' }}>
      <Content>
        <EndRaceButton />
      </Content>
      <Footer>
        <Text type='secondary'>"Stroller" © {dayjs().year().toString()}</Text>
      </Footer>
    </Layout>
  );
};

export default SettingsPage;
