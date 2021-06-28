/* global Parse */

const { Request, Response } = require('oauth2-server');
const oauthServer = require('./oauth-server');

const getOAuthUserFromRequest = async (req, res) => {
  try {
    const token = await oauthServer.authenticate(
      new Request(req),
      new Response(res),
    );

    if (token?.client?.id && token?.user?.id) {
      const [client, user] = await Promise.all([
        new Parse.Query('OAuthApplication').get(token.client.id, {
          useMasterKey: true,
        }),
        new Parse.Query(Parse.User).get(token.user.id, { useMasterKey: true }),
      ]);
      if (!client || !user) {
        return {};
      }

      return { token, user, client };
    }

    return {};
  } catch (err) {
    //do not crash if request does not have oauth data
    return {};
  }
};

module.exports = {
  getOAuthUserFromRequest,
};
