// this option is given to pass the linter but the functions are not working
/* eslint-disable no-invalid-this */
// All credit to https://github.com/bhtz/parse-server-swagger
// the code is adapted for our use case

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const request = require('request-promise');
const { parseSchemaToSwagger } = require('./schema-to-swagger');
const parseBaseSwaggerSpec = require('./parse-swagger-base.json');

/**
 * constructor
 * @param {Object} options options
 * @returns {Object} app: express middleware
 */
const ParseSwagger = function (options) {
  this.config = options;

  const app = express();

  const swagOpts = { swaggerUrl: `${this.config.host}/api-docs` };
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null, swagOpts));
  app.use('/api-docs', this.renderSwaggerSpec.bind(this));

  return app;
};

/**
 * Get parse compatible api swagger.json base
 * @param {any} _ unused argument
 * @param {object} res res
 * @returns {void}
 */
ParseSwagger.prototype.renderSwaggerSpec = (_, res) => {
  const options = {
    url: `${this.config.host} ${this.config.apiRoot}/schemas`,
    method: 'GET',
    json: true,
    headers: {
      'X-Parse-Application-Id': this.config.appId,
      'X-Parse-Master-Key': this.config.masterKey,
    },
  };

  const excludes = this.config.excludes || [];

  request(options)
    .then((data) => {
      const swagger = parseSchemaToSwagger(
        parseBaseSwaggerSpec,
        data.results,
        excludes,
      );
      res.json(swagger);
    })
    .catch((error) => {
      res.send(`Request failed with response code ${error.statu}`);
    });
};

module.exports = ParseSwagger;
