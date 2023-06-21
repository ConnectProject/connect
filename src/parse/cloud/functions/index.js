import githubAuth from './github-auth.js';
import userTokensManagementService from './user-tokens-management.js';
import OAuth from './oauth.js';

export default (Parse) => {
  userTokensManagementService(Parse);
  githubAuth(Parse);
  OAuth(Parse);
};
