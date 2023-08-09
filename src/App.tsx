import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import RacePage from './pages/RacePage';
import SettingsPage from './pages/SettingsPage';
import useAlertSounds from './util/useAlertSounds';
import NavBar from './components/NavBar';

function App() {
  useAlertSounds();

  return (
    <Layout style={{ height: '100vh' }}>
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
