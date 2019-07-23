const Parse = require('parse/node');
const { PARSE_APP_ID, PARSE_MASTER_KEY, API_URL } = require('./../config');

Parse.initialize(PARSE_APP_ID, '', PARSE_MASTER_KEY);
Parse.serverURL = `${API_URL}/parse`;

module.exports = Parse;
