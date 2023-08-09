import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderNav from './components/HeaderNav';
import { Navigate, Route, Routes } from 'react-router-dom';
import RacePage from './pages/RacePage';
import SettingsPage from './pages/SettingsPage';
import useAlertSounds from './util/useAlertSounds';

function App() {
  useAlertSounds();

  return (
    <Layout style={{ height: '100vh' }}>
      <HeaderNav />
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route element={<RacePage />} path='/race' />
          <Route element={<SettingsPage />} path='/settings' />
          <Route element={<Navigate to='/race' replace />} path='*' />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
