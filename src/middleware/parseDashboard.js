const ParseDashboard = require('parse-dashboard');
const {
  APP_PORT,
  APP_PROTOCOL,
  APP_HOST,
  SANDBOX_PORT,
  SANDBOX_PROTOCOL,
  SANDBOX_HOST,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_MASTER_KEY,
  PARSE_READONLY_MASTER_KEY,
  PARSE_DASHBOARD_MAINTENER_PWD,
  PARSE_DASHBOARD_ROOT_PWD,
} = require('../config');

module.exports = () =>
  new ParseDashboard({
    apps: [
      {
        serverURL: `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/parse`,
        appId: PARSE_APP_ID,
        masterKey: PARSE_MASTER_KEY,
        readOnlyMasterKey: PARSE_READONLY_MASTER_KEY,
        appName: PARSE_APP_NAME,
      },
      {
        serverURL: `${SANDBOX_PROTOCOL}://${SANDBOX_HOST}:${SANDBOX_PORT}/parse-sandbox`,
        appId: `${PARSE_APP_ID}-sandbox`,
        masterKey: PARSE_MASTER_KEY,
        readOnlyMasterKey: PARSE_READONLY_MASTER_KEY,
        appName: `${PARSE_APP_NAME}-sandbox`,
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
