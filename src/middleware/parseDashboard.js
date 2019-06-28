var ParseDashboard = require('parse-dashboard');
const {
  APP_PORT,
  APP_PROTOCOL,
  APP_HOST,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_MASTER_KEY,
} = require('./../config');

module.exports = new ParseDashboard({
  apps: [
    {
      serverURL: `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/parse`,
      appId: PARSE_APP_ID,
      masterKey: PARSE_MASTER_KEY,
      appName: PARSE_APP_NAME,
    },
  ],
});
