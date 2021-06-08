const githubAuth = require('./github-auth');
const OAuth = require('./oauth');

module.exports = (Parse) => {
  githubAuth(Parse);
  OAuth(Parse);
};
