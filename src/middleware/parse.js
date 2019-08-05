const { ParseServer } = require('parse-server');
const {
  API_URL,
  MONGO_URI,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_FILE_KEY,
  PARSE_MASTER_KEY,
  PARSE_READONLY_MASTER_KEY,
  PARSE_SILENT,
} = require('./../config');
const cloud = require('./../parse/cloud/main');

class ParseMiddelware {
  constructor(app) {
    this.app = app;
  }

  static start(options, parseCloudEvent) {
    return new Promise(resolve => {
      let parseMiddelware;
      const parseOptions = Object.assign(options, {
        cloud: Parse => {
          cloud(Parse, parseCloudEvent);
        },
        serverStartComplete: () => {
          resolve(parseMiddelware);
        },
      });

      const app = new ParseServer(parseOptions);
      parseMiddelware = new ParseMiddelware(app);
    });
  }
}

module.exports = parseCloudEvent =>
  ParseMiddelware.start(
    {
      databaseURI: MONGO_URI,
      appId: PARSE_APP_ID,
      fileKey: PARSE_FILE_KEY,
      masterKey: PARSE_MASTER_KEY,
      readOnlyMasterKey: PARSE_READONLY_MASTER_KEY,
      appName: PARSE_APP_NAME,
      allowClientClassCreation: false,
      enableAnonymousUsers: false,
      maxLimit: 100,
      serverURL: `${API_URL}/parse`,
      silent: PARSE_SILENT,
    },
    parseCloudEvent,
  );
