// All credit to https://github.com/bhtz/parse-server-swagger
// the code is adapted for our use case

import { createRequire } from 'node:module';

import express from 'express';
import swaggerUi from 'swagger-ui-express';

import getSchemas from '../schema/getSchemas.js';

import { jsonSchemasToSwagger } from './schema-to-swagger.js';


const require = createRequire(import.meta.url);
const parseBaseSwaggerSpec = require('./parse-swagger-base.json');

/**
 * constructor
 * @param {Object} config config
 * @returns {Object} app: express middleware
 */
const ParseSwagger = function ParseSwagger (config) {
  const app = express();

  app.use('/api-docs', async (_, res) => {

    try {
      const excludes = config.excludes || [];
      const schemas = await getSchemas();
      const swagger = jsonSchemasToSwagger(
        parseBaseSwaggerSpec,
        schemas,
        excludes,
      );
      res.json(swagger);
    }
    catch (error) {
      res.send(`Request failed with response code ${error.status}`);
    }
  });

  const swagOpts = { swaggerUrl: `/api-docs` };
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null, swagOpts));

  return app;
};

export default ParseSwagger;
