import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { IntercomProvider } from 'react-use-intercom';

import App from './App';
import GlobalErrorBoundry from './components/GlobalErrorBoundry';

const root = ReactDOM.createRoot(document.getElementById('root'));

const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_ID || 'sr0fg0j1';

root.render(
  <GlobalErrorBoundry>
    <BrowserRouter>
      <IntercomProvider appId={INTERCOM_APP_ID}>
        <App />
      </IntercomProvider>
    </BrowserRouter>
  </GlobalErrorBoundry>
);
