import { Request, Response } from 'oauth2-server';
import oAuthMiddleware from './oauth-middleware.js';
import oauthServer from './oauth-server.js';

export default (app) => {
  app.post('/oauth/token', async (req, res, next) => {
    try {
      const response = new Response(res);
      const token = await oauthServer.token(new Request(req), response);
      // doesn't seem to be useful
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
