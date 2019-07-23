const ParseSwagger = require('../parse/parse-server-swagger');
const { PARSE_APP_ID, PARSE_MASTER_KEY, API_URL } = require('./../config');

module.exports = new ParseSwagger({
  host: API_URL,
  apiRoot: '/parse',
  appId: PARSE_APP_ID,
  masterKey: PARSE_MASTER_KEY,
  excludes: ['_User', '_Role', '_Product', '_Session'],
});
