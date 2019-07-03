const applicationService = require('../services/application');
const createValidator = require('./validator/applicationCreate');
const logger = require('./../../logger');

module.exports = {
  create: async (req, res) => {
    try {
      const valid = createValidator(req.body);

      if (valid) {
        res.status(400).send(valid);
      }

      const application = await applicationService.create(
        req.auth.developer,
        req.body,
      );

      res.send(application);
    } catch (err) {
      logger(err);
      res.sendStatus(500);
    }
  },
  update: async (req, res) => {
    try {
      const valid = createValidator(req.body);

      if (valid) {
        res.status(400).send(valid);
      }

      const application = await applicationService.update(
        req.params.id,
        req.auth.developer,
        req.body,
      );

      res.send(application);
    } catch (err) {
      logger(err);
      res.sendStatus(500);
    }
  },
};
