const express = require('express');
const path = require('path');
const cors = require('cors');
const { EventEmitter, once } = require('events');

const logger = require('./logger');
const oauthApi = require('./oauth/oauth-routes');
const parseApi = require('./middleware/parse');
const parseDashboard = require('./middleware/parseDashboard');
const parseSwagger = require('./middleware/parseSwagger');
const sandboxMiddleware = require('./middleware/sandboxMiddleware');
const oauthMiddleware = require('./oauth/oauth-middleware');

// eslint-disable-next-line max-statements
const start = async function (port, parseCloudEvent) {
  logger.info(`start connect express server on port ${port}.`);

  process.on('unhandledRejection', (err) => {
    throw err;
  });

  const app = express();

  // app.use(express.json());

  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));

  // transform the eventuel OAuth Bearer token to an actual Parse user
  app.use('/parse/batch', oauthMiddleware);
  app.use('/parse/classes', oauthMiddleware);

  app.use('/parse/batch', sandboxMiddleware);
  app.use('/parse/classes', sandboxMiddleware);

  // Serve the Parse API at /parse URL prefix
  const parseMiddleware = await parseApi(parseCloudEvent);
  app.use('/parse', parseMiddleware.app);
  app.use('/dashboard', parseDashboard());
  app.use(parseSwagger());

  // handle all routing for /oauth/*
  oauthApi(app);

  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable global-require, import/no-extraneous-dependencies */
    const webpack = require('webpack');
    const middleware = require('webpack-dev-middleware');
    const webpackConfig = require('../webpack.config');
    const compiler = webpack(webpackConfig);
    const { publicPath } = webpackConfig.output;
    const history = require('connect-history-api-fallback');
    app.use(history());
    app.use(middleware(compiler, { publicPath }));
    /* eslint-enable global-require, import/no-extraneous-dependencies */
  } else {
    // Serve any static files
    app.use(express.static(path.join(__dirname, './../build')));

    // Handle React routing, return all requests to React app
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, './../build', 'index.html'));
    });
  }

  const ee = new EventEmitter()

  const server = app.listen(port, () => {
    logger.info(`connect running on port ${port}.`);
    ee.emit('listening')
  });

  await once(ee, 'listening');

  return { app, server };
}

module.exports = { start };
