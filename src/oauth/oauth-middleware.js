/* eslint-disable max-statements */

import { getOAuthUserFromRequest } from './oauth-service.js';

export default async (req, res, next) => {
  try {
    const { token, client, user } = await getOAuthUserFromRequest(req, res);

    if (client && user) {
      res.locals.oauth = {
        token,
        user,
      };

      // the next line is useless since the request gets cleaned by Parse
      req.application = client;

      // used to tell Parse that the user is authenticated with JWT
      req.userFromJWT = user;
    }
  } catch (_err) {
    // not OAuth authenticated
  }

  return next();
};
