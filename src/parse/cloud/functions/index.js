const githubAuth = require('./github-auth');

module.exports = async (Parse) => {
  await githubAuth(Parse);
};
