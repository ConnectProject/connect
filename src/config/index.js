require('dotenv').config();

function testConfig(config, name) {
  if (
    (!config && config !== false && config !== 'false') ||
    (config + '').length <= 0
  ) {
    throw new Error(
      `Undefined config ${name}: ${JSON.stringify(process.env)} `,
    );
  }
}

const APP_PORT = process.env.APP_PORT;
testConfig(APP_PORT, 'APP_PORT');

const APP_PROTOCOL = process.env.APP_PROTOCOL;
testConfig(APP_PROTOCOL, 'APP_PROTOCOL');

const APP_HOST = process.env.APP_HOST;
testConfig(APP_HOST, 'APP_HOST');

const PARSE_APP_NAME = process.env.PARSE_APP_NAME;
testConfig(PARSE_APP_NAME, 'PARSE_APP_NAME');

const PARSE_APP_ID = process.env.PARSE_APP_ID;
testConfig(PARSE_APP_ID, 'PARSE_APP_ID');

const PARSE_FILE_KEY = process.env.PARSE_FILE_KEY;
testConfig(PARSE_FILE_KEY, 'PARSE_FILE_KEY');

const PARSE_MASTER_KEY = process.env.PARSE_MASTER_KEY;
testConfig(PARSE_MASTER_KEY, 'PARSE_MASTER_KEY');

const MONGO_PORT = process.env.MONGO_PORT;
testConfig(MONGO_PORT, 'MONGO_PORT');

const MONGO_HOST = process.env.MONGO_HOST;
testConfig(MONGO_HOST, 'MONGO_HOST');

const MONGO_USERNAME = process.env.MONGO_USERNAME;
testConfig(MONGO_USERNAME, 'MONGO_USERNAME');

const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
testConfig(MONGO_PASSWORD, 'MONGO_PASSWORD');

const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
testConfig(MONGO_DB_NAME, 'MONGO_DB_NAME');

module.exports = {
  APP_PORT,
  APP_PROTOCOL,
  APP_HOST,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_FILE_KEY,
  PARSE_MASTER_KEY,
  MONGO_PORT,
  MONGO_HOST,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB_NAME,
};
