const authMiddleware = require('./middleware/auth');
const authController = require('./controller/auth');
const applicationController = require('./controller/application');

module.exports = srv => {
  srv.use('/api/*', authMiddleware);

  // auth
  srv.post('/api/auth', authController.github);

  // application
  srv.post('/api/application', applicationController.create);
  srv.put('/api/application/:id', applicationController.update);
};
