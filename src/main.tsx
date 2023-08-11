import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RaceContextProvider } from './store/RaceContext.tsx';
import { HashRouter } from 'react-router-dom';
import { SettingsContextProvider } from './store/SettingsContext.tsx';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RaceContextProvider>
        <SettingsContextProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </SettingsContextProvider>
      </RaceContextProvider>
    </React.StrictMode>
  );
}
