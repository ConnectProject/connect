const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const logger = require('../../logger');
const { AUTH_SECRET } = require('../../config');
const mongoModel = require('../../db/model');

const jwtVerify = promisify(jwt.verify);

const bearerLength = 'Bearer '.length;

const getTokenFromAuthHeader = (header) => {
  if (header && header.length > bearerLength) {
    return header.slice(bearerLength);
  }

  return null;
};

const getUserFromAuthHeader = (secretOrPublicKey, authorization) => {
  const token = getTokenFromAuthHeader(authorization);
  if (token) {
    try {
      return jwtVerify(token, secretOrPublicKey);
    } catch (e) {
      return null;
    }
  }

  return null;
};

module.exports = async (req, res, next) => {
  try {
    const authorization = req && req.headers && req.headers.authorization;
    const jwtDeveloper = await getUserFromAuthHeader(
      AUTH_SECRET,
      authorization,
    );
    let developer;

    if (jwtDeveloper) {
      developer = await mongoModel()
        .Developer.findOne({
          github_id: jwtDeveloper.id,
        })
        .exec();
    }

    req.auth = {
      jwt: jwtDeveloper,
      developer,
    };

    return next();
  } catch (err) {
    logger.error(err);

    return res.sendStatus(500);
  }
};
