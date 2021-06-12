const express = require('express');
const path = require('path');
const cors = require('cors');
const { once } = require('events');

const api = require('./api');
const logger = require('./logger');
const oauthApi = require('./oauth/oauth-routes');
const parseApi = require('./middleware/parse');
const parseDashboard = require('./middleware/parseDashboard');
const parseSwagger = require('./middleware/parseSwagger');

const configFront = require('./config/front');
const oauthMiddleware = require('./oauth/oauth-middleware');

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

    // transform the eventuel OAuth Bearer token to an actual Parse user
    app.use('/parse/classes', oauthMiddleware);

    // Serve the Parse API at /parse URL prefix
    const parseMiddleware = await parseApi(parseCloudEvent);
    app.use('/parse', parseMiddleware.app);
    app.use('/dashboard', parseDashboard());
    app.use(parseSwagger());

    // handle all routing for /api/*
    api(app);

    // handle all routing for /oauth/*
    oauthApi(app);

    app.get('/envConfig.js', (_, res) => res.send(configFront));

    if (process.env.NODE_ENV === 'development') {
      /* eslint-disable */
      const webpack = require('webpack');
      const middleware = require('webpack-dev-middleware');
      const webpackConfig = require('../webpack.config.js')('development', {
        mode: 'development',
        hot: true,
      });
      const compiler = webpack(webpackConfig);
      const { publicPath } = webpackConfig.output;
      var history = require('connect-history-api-fallback');
      /* eslint-enable */
      app.use(history());
      app.use(middleware(compiler, { publicPath }));
    } else {
      // Serve any static files
      app.use(express.static(path.join(__dirname, './../build')));

      // Handle React routing, return all requests to React app
      app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, './../build', 'index.html'));
      });
    }

    const server = app.listen(port, () => {
      logger.info(`connect running on port ${port}.`);
    });

    await once(server, 'listening');

    return new ConnectServer(app, server);
  }
}

module.exports = ConnectServer;
