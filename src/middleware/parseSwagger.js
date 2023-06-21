import { API_URL, PARSE_APP_ID, PARSE_MASTER_KEY } from '../config/index.js';
import ParseSwagger from '../parse/parse-server-swagger/index.js';

export default () =>
  new ParseSwagger({
    host: API_URL,
    apiRoot: '/parse',
    appId: PARSE_APP_ID,
    masterKey: PARSE_MASTER_KEY,
    excludes: [
      '_User',
      '_Role',
      '_Product',
      '_Session',
      'OAuthApplication',
      'OAuthToken',
      'OAuthAuthorizationCode',
    ],
  });
