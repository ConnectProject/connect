const express = require('express');
const path = require('path');
const cors = require('cors');
const { once } = require('events');

const api = require('./api');
const logger = require('./logger');
const parseApi = require('./middleware/parse');
const parseDashboard = require('./middleware/parseDashboard');
const parseSwagger = require('./middleware/parseSwagger');

const configFront = require('./config/front');

class ConnectServer {
  constructor(app, server) {
    this.app = app;
    this.server = server;
  }

  // eslint-disable-next-line max-statements
  static async start(port, parseCloudEvent) {
    logger.info(`start connect express server on port ${port}.`);

    process.on('unhandledRejection', (err) => {
      throw err;
    });

    const app = express();

    app.use(express.json());

    const corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: true }));

    // Serve the Parse API at /parse URL prefix
    const parseMiddleware = await parseApi(parseCloudEvent);
    app.use('/parse', parseMiddleware.app);
    app.use('/dashboard', parseDashboard());
    app.use(parseSwagger());

    // handle all routing for /api/*
    api(app);

    app.get('/envConfig.js', (_, res) => res.send(configFront));

    // Serve any static files
    app.use(express.static(path.join(__dirname, './../build')));

    // Handle React routing, return all requests to React app
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, './../build', 'index.html'));
    });

    const server = app.listen(port, () => {
      logger.info(`connect running on port ${port}.`);
    });

    await once(server, 'listening');

    return new ConnectServer(app, server);
  }
}

module.exports = ConnectServer;
