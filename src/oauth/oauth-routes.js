const { Request, Response } = require('oauth2-server');
const oAuthMiddleware = require('./oauth-middleware');
const oauthServer = require('./oauth-server');

module.exports = (app) => {
  app.post('/oauth/token', async (req, res, next) => {
    try {
      const response = new Response(res);
      const token = await oauthServer.token(new Request(req), response);
      res.locals.oauth = { token: token };

      res.set(response.headers);
      res.status(response.status ?? 200).send(response.body);
    } catch (err) {
      return next(err);
    }
  });

  app.get('/oauth/user', oAuthMiddleware, (req, res, next) => {
    try {
      const userId = req.userFromJWT?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }

      return res.json({
        id: userId,
      });
    } catch (err) {
      return next(err);
    }
  });
};
