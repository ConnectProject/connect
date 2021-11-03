// All credit to https://github.com/bhtz/parse-server-swagger
// the code is adapted for our use case

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const request = require('request-promise');
const { parseSchemaToSwagger } = require('./schema-to-swagger');
const parseBaseSwaggerSpec = require('./parse-swagger-base.json');

/**
 * constructor
 * @param {Object} config config
 * @returns {Object} app: express middleware
 */
const ParseSwagger = function (config) {
  const app = express();

  app.use('/api-docs', (_, res) => {
    const apiDocsOptions = {
      url: `${config.host}${config.apiRoot}/schemas`,
      method: 'GET',
      json: true,
      headers: {
        'X-Parse-Application-Id': config.appId,
        'X-Parse-Master-Key': config.masterKey,
      },
    };

    const excludes = config.excludes || [];

    request(apiDocsOptions)
      .then((data) => {
        const swagger = parseSchemaToSwagger(
          parseBaseSwaggerSpec,
          data.results,
          excludes,
        );
        res.json(swagger);
      })
      .catch((error) => {
        res.send(`Request failed with response code ${error.status}`);
      });
  });

  const swagOpts = { swaggerUrl: `/api-docs` };
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null, swagOpts));

  return app;
};

module.exports = ParseSwagger;
