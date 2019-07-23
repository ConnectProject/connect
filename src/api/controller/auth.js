const Auth = require('./../services/auth');
const logger = require('./../../logger');

module.exports = {
  github: async (req, res) => {
    try {
      const authService = new Auth();
      const jwt = await authService.connectUser(req.body.code);

      res.send(jwt);
    } catch (err) {
      logger(err);
      res.sendStatus(500);
    }
  },
};
