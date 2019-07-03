const Developer = require('./../../db/model/developer');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const logger = require('./../../logger');
const { AUTH_SECRET } = require('./../../config');

const jwtVerify = promisify(jwt.verify);

const bearerLength = 'Bearer '.length;

const getTokenFromAuthHeader = header => {
  if (header && header.length > bearerLength) {
    return header.slice(bearerLength);
  }
  return null;
};

const getUserFromAuthHeader = async (secretOrPublicKey, authorization) => {
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
      developer = await Developer.findOne({
        github_id: jwtDeveloper.id,
      }).exec();
    }

    req.auth = {
      jwt: jwtDeveloper,
      developer,
    };

    return next();
  } catch (err) {
    logger(err);
    return res.sendStatus(500);
  }
};
