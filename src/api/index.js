const authMiddleware = require('./middleware/auth');
const aclMiddleware = require('./middleware/acl');
const authController = require('./controller/auth');
const applicationController = require('./controller/application');

module.exports = srv => {
  srv.use('/api/*', authMiddleware);
  srv.use('/api/*', aclMiddleware);

  // auth
  srv.post('/api/auth', authController.github);

  // application
  srv.get('/api/application', applicationController.list);
  srv.get('/api/application/:id', applicationController.get);
  srv.post('/api/application', applicationController.create);
  srv.put('/api/application/:id', applicationController.update);
};
