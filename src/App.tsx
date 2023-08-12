import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import RacePage from './pages/RacePage';
import SettingsPage from './pages/SettingsPage';
import useAutomatedAlerts from './util/useAutomatedAlerts';
import NavBar from './components/NavBar';
import useScreenWakeLock from './util/useScreenWakeLock';

function App() {
  useAutomatedAlerts();
  useScreenWakeLock();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavBar />
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
