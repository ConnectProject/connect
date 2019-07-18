const model = require('./../db/model');

module.exports = async (req, res, next) => {
  try {
    req.model = model;

    return next();
  } catch (err) {
    logger(err);
    return res.sendStatus(500);
  }
};
