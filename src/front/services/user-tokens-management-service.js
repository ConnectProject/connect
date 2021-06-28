import Parse from 'parse';

const getGrantedTokens = async () => {
  const tokens = await Parse.Cloud.run('get-granted-tokens');

  return tokens;
};

const revokeToken = async ({ tokenId }) => {
  const authorizationCode = await Parse.Cloud.run('revoke-token', {
    id: tokenId,
  });

  return authorizationCode;
};

export default {
  getGrantedTokens,
  revokeToken,
};
