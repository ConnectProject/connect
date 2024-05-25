import githubAuth from './github-auth.js';
import OAuth from './oauth.js';
import userTokensManagementService from './user-tokens-management.js';

export default (Parse) => {
  userTokensManagementService(Parse);
  githubAuth(Parse);
  OAuth(Parse);
};
