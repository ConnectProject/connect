require('dotenv').config();

function testConfig(config, name) {
  if (
    (!config && config !== false && config !== 'false') ||
    `${config}`.length <= 0
  ) {
    throw new Error(
      `Undefined config ${name}: ${JSON.stringify(process.env)} `,
    );
  }
}

const DEBUG = process.env.DEBUG || false;

const { PUBLIC_URL } = process.env;
testConfig(PUBLIC_URL, 'PUBLIC_URL');

const { FRONT_PORT } = process.env;
testConfig(FRONT_PORT, 'FRONT_PORT');

const { API_URL } = process.env;
testConfig(API_URL, 'API_URL');

const { APP_PORT } = process.env;
testConfig(APP_PORT, 'APP_PORT');

const { APP_PROTOCOL } = process.env;
testConfig(APP_PROTOCOL, 'APP_PROTOCOL');

const { APP_HOST } = process.env;
testConfig(APP_HOST, 'APP_HOST');

const { SANDBOX_URL } = process.env;
testConfig(SANDBOX_URL, 'SANDBOX_URL');

const { SANDBOX_PORT } = process.env;
testConfig(SANDBOX_PORT, 'SANDBOX_PORT');

const { SANDBOX_PROTOCOL } = process.env;
testConfig(SANDBOX_PROTOCOL, 'SANDBOX_PROTOCOL');

const { SANDBOX_HOST } = process.env;
testConfig(SANDBOX_HOST, 'SANDBOX_HOST');

const { PARSE_APP_NAME } = process.env;
testConfig(PARSE_APP_NAME, 'PARSE_APP_NAME');

const { PARSE_APP_ID } = process.env;
testConfig(PARSE_APP_ID, 'PARSE_APP_ID');

const { PARSE_FILE_KEY } = process.env;
testConfig(PARSE_FILE_KEY, 'PARSE_FILE_KEY');

const { PARSE_MASTER_KEY } = process.env;
testConfig(PARSE_MASTER_KEY, 'PARSE_MASTER_KEY');

const { PARSE_READONLY_MASTER_KEY } = process.env;
testConfig(PARSE_READONLY_MASTER_KEY, 'PARSE_READONLY_MASTER_KEY');

const { PARSE_DASHBOARD_MAINTENER_PWD } = process.env;
testConfig(PARSE_DASHBOARD_MAINTENER_PWD, 'PARSE_DASHBOARD_MAINTENER_PWD');

const { PARSE_DASHBOARD_ROOT_PWD } = process.env;
testConfig(PARSE_DASHBOARD_ROOT_PWD, 'PARSE_DASHBOARD_ROOT_PWD');

const { MONGO_PORT } = process.env;
testConfig(MONGO_PORT, 'MONGO_PORT');

const { MONGO_HOST } = process.env;
testConfig(MONGO_HOST, 'MONGO_HOST');

const { MONGO_USERNAME } = process.env;

const { MONGO_PASSWORD } = process.env;

const { MONGO_DB_NAME } = process.env;
testConfig(MONGO_DB_NAME, 'MONGO_DB_NAME');

const { AUTH_SECRET } = process.env;
testConfig(AUTH_SECRET, 'AUTH_SECRET');

const { GITHUB_CLIENT_ID } = process.env;
testConfig(GITHUB_CLIENT_ID, 'GITHUB_CLIENT_ID');

const { GITHUB_CLIENT_SECRET } = process.env;
testConfig(GITHUB_CLIENT_SECRET, 'GITHUB_CLIENT_SECRET');

module.exports = {
  DEBUG,
  PUBLIC_URL,
  FRONT_PORT,
  API_URL,
  APP_PORT,
  APP_PROTOCOL,
  APP_HOST,
  SANDBOX_URL,
  SANDBOX_PORT,
  SANDBOX_PROTOCOL,
  SANDBOX_HOST,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_FILE_KEY,
  PARSE_MASTER_KEY,
  PARSE_READONLY_MASTER_KEY,
  PARSE_DASHBOARD_MAINTENER_PWD,
  PARSE_DASHBOARD_ROOT_PWD,
  PARSE_SANDBOX: true,
  PARSE_SILENT: false,
  MONGO_URI: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
  AUTH_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
};
