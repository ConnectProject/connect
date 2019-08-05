const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

let parseConnect;
let apiConnect;
let parseSandboxConnect;

module.exports = () => {
  if (!parseConnect) {
    parseConnect = mongoose.createConnection(MONGO_URI);
  }

  if (!apiConnect) {
    apiConnect = mongoose.createConnection(`${MONGO_URI}-api`);
  }

  if (!parseSandboxConnect) {
    parseSandboxConnect = mongoose.createConnection(`${MONGO_URI}-sandbox`);
  }

  return {
    parseConnect,
    apiConnect,
    parseSandboxConnect,
  };
};
