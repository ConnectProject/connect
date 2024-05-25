import ParseDashboard from 'parse-dashboard';

import {
  PUBLIC_URL,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_MASTER_KEY,
  PARSE_READONLY_MASTER_KEY,
  PARSE_DASHBOARD_MAINTENER_PWD,
  PARSE_DASHBOARD_ROOT_PWD,
} from '../config/index.js';

export default () =>
  new ParseDashboard({
    apps: [
      {
        serverURL: `${PUBLIC_URL}/parse`,
        appId: PARSE_APP_ID,
        masterKey: PARSE_MASTER_KEY,
        readOnlyMasterKey: PARSE_READONLY_MASTER_KEY,
        appName: PARSE_APP_NAME,
      },
    ],
    users: [
      {
        user: 'maintener',
        pass: PARSE_DASHBOARD_MAINTENER_PWD,
        readOnly: true,
      },
      {
        user: 'root',
        pass: PARSE_DASHBOARD_ROOT_PWD,
      },
    ],
    useEncryptedPasswords: true,
    trustProxy: 1,
  });
