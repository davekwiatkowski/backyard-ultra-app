import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RaceContextProvider } from './store/RaceContext.tsx';
import { HashRouter } from 'react-router-dom';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RaceContextProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </RaceContextProvider>
    </React.StrictMode>
  );
}
