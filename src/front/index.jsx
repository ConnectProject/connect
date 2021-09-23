import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Parse from 'parse';

import App from './component/App';
import './index.css';

Parse.initialize(window._env_.PARSE_APP_ID, window._env_.PARSE_JAVASCRIPT_KEY);
Parse.serverURL = `${window._env_.PUBLIC_URL}/parse`;

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
