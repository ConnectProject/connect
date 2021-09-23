/* eslint-disable max-statements */

const { getOAuthUserFromRequest } = require('./oauth-service');

module.exports = async (req, res, next) => {
  try {
    const { token, client, user } = await getOAuthUserFromRequest(req, res);

    if (client && user) {
      res.locals.oauth = {
        token,
        user,
      };

      // the next line is useless since the request gets cleaned by Parse
      req.application = client;

      req.userFromJWT = user;
    }
  } catch (_err) {
    // not OAuth authenticated
  }

  return next();
};
