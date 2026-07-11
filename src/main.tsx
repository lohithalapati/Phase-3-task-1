import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from '@providers/AppProviders';
import { RouteProvider } from '@providers/RouteProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <RouteProvider />
    </AppProviders>
  </React.StrictMode>
);