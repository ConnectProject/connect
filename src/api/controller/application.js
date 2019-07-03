const applicationService = require('../services/application');
const createValidator = require('./validator/applicationCreate');
const logger = require('./../../logger');

module.exports = {
  list: async (req, res) => {
    try {
      const applications = await applicationService.list(req.auth.developer);

      return res.send(applications);
    } catch (err) {
      logger(err);
      return res.sendStatus(500);
    }
  },
  get: async (req, res) => {
    try {
      const application = await applicationService.get(
        req.auth.developer,
        req.params.id,
      );

      if (!application) {
        return res.sendStatus(404);
      }

      return res.send(application);
    } catch (err) {
      logger(err);
      return res.sendStatus(500);
    }
  },
  create: async (req, res) => {
    try {
      const valid = createValidator(req.body);

      if (valid) {
        return res.status(400).send(valid);
      }

      const application = await applicationService.create(
        req.auth.developer,
        req.body,
      );

      return res.send(application);
    } catch (err) {
      logger(err);
      return res.sendStatus(500);
    }
  },
  update: async (req, res) => {
    try {
      const valid = createValidator(req.body);

      if (valid) {
        return res.status(400).send(valid);
      }

      const application = await applicationService.update(
        req.params.id,
        req.auth.developer,
        req.body,
      );

      return res.send(application);
    } catch (err) {
      logger(err);
      return res.sendStatus(500);
    }
  },
};
