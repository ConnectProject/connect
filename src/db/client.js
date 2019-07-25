const mongoose = require('mongoose');
const {
  MONGO_DB_NAME,
  MONGO_HOST,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PORT,
} = require('../config');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('debug', true);

const parseConnect = mongoose.createConnection(
  `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
);
const apiConnect = mongoose.createConnection(
  `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}-api`,
);
const parseSandboxConnect = mongoose.createConnection(
  `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}-sandbox`,
);

module.exports = {
  parseConnect,
  apiConnect,
  parseSandboxConnect,
};
