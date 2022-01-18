import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Parse from 'parse';

import App from './component/App';
import './index.css';

Parse.initialize(process.env.PARSE_APP_ID);
Parse.serverURL = `${process.env.PUBLIC_URL}/parse`;

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
