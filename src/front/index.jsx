import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Parse from 'parse';

import App from './component/App';
import './index.css';

Parse.initialize(process.env.PARSE_APP_ID);
Parse.serverURL = `${process.env.PUBLIC_URL}/parse`;

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
