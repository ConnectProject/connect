const DeveloperService = require('../services/developer');
const logger = require('./../../logger');

module.exports = {
  delete: async (req, res) => {
    try {
      const developerService = new DeveloperService({
        applicationModel: req.model.application,
        developerModel: req.model.developer,
      });
      const application = await developerService.delete(req.auth.developer);

      return res.send(application);
    } catch (err) {
      logger(err);
      return res.sendStatus(500);
    }
  },
};
