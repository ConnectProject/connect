import { Request, Response } from 'oauth2-server';

import oauthModel from '../../../oauth/oauth-model.js';
import oauthServer from '../../../oauth/oauth-server.js';

export default (Parse) => {
  Parse.Cloud.define('oauth-get-application', async (request) => {
    const { clientId, redirectUri } = request.params;

    if (!clientId) {
      throw new Error('No client provided');
    }

    const client = await oauthModel.getClient(clientId);

    if (!client) {
      throw new Error('Client not found');
    }

    if (!redirectUri) {
      throw new Error('No redirect URI provided');
    }

    if (!oauthModel.isRedirectUriValidity(redirectUri, client.redirectUris)) {
      throw new Error('Incorrect redirect URI specified');
    }

    return {
      id: client.id,
      name: client.name,
      description: client.description,
      redirectUri,
      allowImplicitGrant: client.grants.includes('implicit')
    };
  });

  Parse.Cloud.define('oauth-authorize-request', async (request) => {

    const oauthRequest = new Request({
      body: request.params,
      headers: {},
      method: {},
      query: {},
      user: request.user
    });

    const response = new Response({
      body: {},
      headers: {},
      method: {},
      query: {}
    });


    // eslint-disable-next-line no-unused-vars
    const codeOrToken = await oauthServer.authorize(oauthRequest, response);

    return response.headers.location;
  });
};
