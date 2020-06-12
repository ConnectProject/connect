const connectServer = require('./connectServer');
const { APP_PORT } = require('./config');

connectServer.start(APP_PORT);
