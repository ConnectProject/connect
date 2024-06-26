import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import bodyParserErrorHandler from 'express-body-parser-error-handler';

import logger from './logger.js';
import parseApi from './middleware/parse.js';
import parseDashboard from './middleware/parseDashboard.js';
import parseSwagger from './middleware/parseSwagger.js';
import sandboxMiddleware from './middleware/sandboxMiddleware.js';
import oauthMiddleware from './oauth/oauth-middleware.js';
import oauthApi from './oauth/oauth-routes.js';

// eslint-disable-next-line max-statements
const start = async function start (port, parseCloudEvent) {
  logger.info(`start connect express server on port ${port}.`);

  process.on('unhandledRejection', (err) => {
    logger.error(err);
    throw err;
  });

  const app = express();

  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParserErrorHandler());

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
    /* eslint-disable import/no-extraneous-dependencies */
    const webpack = (await import('webpack')).default;
    const middleware = (await import('webpack-dev-middleware')).default;
    const webpackConfig = (await import('../webpack.config.js')).default;
    const history = (await import('connect-history-api-fallback')).default;

    const compiler = webpack(webpackConfig);
    const { publicPath } = webpackConfig.output;
    app.use(history());
    app.use(middleware(compiler, { publicPath }));
    /* eslint-enable import/no-extraneous-dependencies */
  } else {
    // Serve any static files
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    app.use(express.static(path.join(__dirname, './../build')));

    // Handle React routing, return all requests to React app
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, './../build', 'index.html'));
    });
  }

  const server = app.listen(port, () => {
    logger.info(`connect running on port ${port}.`);
  });

  await new Promise((resolve, reject) => {
    server.on('listening', resolve);
    server.on('error', reject);
  });

  return { app, server };
};

export default { start };
