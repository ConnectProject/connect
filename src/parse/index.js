const Parse = require('parse/node');
const { PARSE_APP_ID, PARSE_MASTER_KEY, PUBLIC_URL } = require('./../config');

Parse.initialize(PARSE_APP_ID, '', PARSE_MASTER_KEY);
Parse.serverURL = `${PUBLIC_URL}/parse`;

module.exports = Parse;
