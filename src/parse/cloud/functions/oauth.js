const uuidv4 = require('uuid/v4');
const oauthModel = require('../../../oauth/oauth-model');
const oauthServer = require('../../../oauth/oauth-server');

module.exports = (Parse) => {
  Parse.Cloud.define('oauth-get-application', async (request) => {
    const { clientId, redirectUri } = request.params;

    if (!clientId || !redirectUri) {
      return null;
    }

    const client = await oauthModel.getClient(clientId);

    if (!client) {
      return null;
    }

    if (!oauthModel.isRedirectUriValidity(redirectUri, client.redirectUris)) {
      return null;
    }

    return {
      id: client.id,
      name: client.name,
      description: client.description,
      redirectUri,
    };
  });

  Parse.Cloud.define('oauth-create-authorization-code', async (request) => {
    if (!request.user) {
      throw new Error('User not authenticated');
    }
    const { clientId, redirectUri } = request.params;

    if (!clientId || !redirectUri) {
      throw new Error('Missing clientId or redirectUri');
    }

    const client = await oauthModel.getClient(clientId);

    if (!oauthModel.isRedirectUriValidity(redirectUri, client.redirectUris)) {
      return null;
    }

    const user = {
      id: request.user.id,
    };

    const authorizationCode = await oauthModel.saveAuthorizationCode(
      {
        authorizationCode: uuidv4().replace(/-/g, ''),
        expiresAt: new Date(
          Date.now() + oauthServer.options.authorizationCodeLifetime * 1000,
        ),
        redirectUri,
      },
      client,
      user,
    );

    return authorizationCode;
  });
};
