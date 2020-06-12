const logger = require('./../../logger');

module.exports = async (req, res, next) => {
  try {
    if (req.baseUrl.match('/api/auth')) {
      return next();
    }

    if (req.auth.developer && req.auth.developer._id) {
      return next();
    }

    return res.sendStatus(403);
  } catch (err) {
    logger.error(err);
    return res.sendStatus(500);
  }
};
