import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import NavBar from './components/NavBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import RacePage from './pages/RacePage';
import SettingsPage from './pages/SettingsPage';
import useAlertSounds from './util/useAlertSounds';
import { MobileView, BrowserView } from 'react-device-detect';

function App() {
  useAlertSounds();

  return (
    <Layout style={{ height: '100vh' }}>
      <BrowserView>
        <NavBar />
      </BrowserView>
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route element={<RacePage />} path='/race' />
          <Route element={<SettingsPage />} path='/settings' />
          <Route element={<Navigate to='/race' replace />} path='*' />
        </Routes>
      </Content>
      <MobileView>
        <NavBar />
      </MobileView>
    </Layout>
  );
}

export default App;
