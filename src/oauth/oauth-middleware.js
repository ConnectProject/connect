/* eslint-disable max-statements */
/* global Parse */

const uuidv4 = require('uuid/v4');

const { getOAuthUserFromRequest } = require('./oauth-service');

module.exports = async (req, res, next) => {
  try {
    const { token, client, user } = await getOAuthUserFromRequest(req, res);

    if (client && user) {
      res.locals.oauth = {
        token,
        user,
      };

      req.application = client;
      req.user = user;

      // the request is made using a valid OAuth token. We would love to login directly the user, but Parse do not allow us to log a user without it's password, even with the masterKey
      // therefore, we create or reuse another Parse.User, linked to this specific token (using endUserId and applicationId properties), and use the token as a password
      // those users would never be displayed, but they are used to manage ACLs on each object (each object can be updated only by the user authenticated using the same application he created it)

      let userForRequest = await new Parse.Query(Parse.User)
        .equalTo('endUserId', user.id)
        .equalTo('applicationId', client.id)
        .first({ useMasterKey: true });

      if (!userForRequest) {
        userForRequest = await Parse.User.signUp(uuidv4(), token.accessToken, {
          endUserId: user.id,
          applicationId: client.id,
        });
      }
      await userForRequest.save(
        { password: token.accessToken },
        { useMasterKey: true },
      );
      await userForRequest.logIn({ useMasterKey: true });

      // make next Parse middleware login the user
      req.userFromJWT = userForRequest;
    }
  } catch (_err) {
    // not OAuth authenticated
  }

  return next();
};
