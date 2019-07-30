const { ParseServer } = require('parse-server');
const {
  SANDBOX_URL,
  MONGO_URI,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_FILE_KEY,
  PARSE_MASTER_KEY,
  PARSE_READONLY_MASTER_KEY,
} = require('./../config');

module.exports = () =>
  new ParseServer({
    databaseURI: `${MONGO_URI}-sandbox`,
    cloud: `${__dirname}./../parse/cloud/main.js`,
    appId: `${PARSE_APP_ID}-sandbox`,
    fileKey: PARSE_FILE_KEY,
    masterKey: PARSE_MASTER_KEY,
    readOnlyMasterKey: PARSE_READONLY_MASTER_KEY,
    appName: `${PARSE_APP_NAME}-sandbox`,
    allowClientClassCreation: false,
    enableAnonymousUsers: false,
    maxLimit: 100,
    serverURL: `${SANDBOX_URL}/parse-sandbox`,
  });
