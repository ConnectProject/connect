const githubAuth = require('./github-auth');
const userTokensManagementService = require('./user-tokens-management');
const OAuth = require('./oauth');

module.exports = (Parse) => {
  userTokensManagementService(Parse);
  githubAuth(Parse);
  OAuth(Parse);
};
