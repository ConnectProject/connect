const authMiddleware = require('./middleware/auth');
const authController = require('./controller/auth');
const applicationController = require('./controller/application');

module.exports = srv => {
  srv.use('/api/*', authMiddleware);

  srv.post('/api/auth', authController.github);
  srv.post('/api/application', applicationController.create);
};
