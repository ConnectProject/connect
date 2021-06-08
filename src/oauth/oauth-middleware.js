/* eslint-disable no-undef */

const { Request, Response } = require('oauth2-server');
const oauthServer = require('./oauth-server');

module.exports = async (req, res, next) => {
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
      if (!client) {
        throw new Error('OAuth client not found');
      }
      if (!user) {
        throw new Error('User not found');
      }
      res.locals.oauth = {
        token,
        user,
      };
      console.log({ client, user }, 'made a request?');
      req.oauthClient = client;
      req.oauthUser = user;
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
