const connectClient = require('../client');
const Developer = require('./developer');
const Application = require('./application');

module.exports = () => {
  const { apiConnect } = connectClient();

  return {
    Developer: Developer(apiConnect),
    Application: Application(apiConnect),
  };
};
