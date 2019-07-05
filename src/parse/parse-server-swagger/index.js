// All credit to https://github.com/bhtz/parse-server-swagger
// the code is adapted for our use case

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const request = require('request-promise');
const parseSchemaToSwagger = require('./schema-to-swagger')
  .parseSchemaToSwagger;
const parseBaseSwaggerSpec = require('./parse-swagger-base.json');

/**
 * constructor
 * @returns app: express middleware
 */
function ParseSwagger(options) {
  this.config = options;

  const app = express();

  const swagOpts = { swaggerUrl: this.config.host + '/api-docs' };
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null, swagOpts));
  app.use('/api-docs', this.renderSwaggerSpec.bind(this));

  return app;
}

/**
 * Get parse compatible api swagger.json base
 */
ParseSwagger.prototype.renderSwaggerSpec = function(_, res) {
  const options = {
    url: this.config.host + this.config.apiRoot + '/schemas',
    method: 'GET',
    json: true,
    headers: {
      'X-Parse-Application-Id': this.config.appId,
      'X-Parse-Master-Key': this.config.masterKey,
    },
  };

  const excludes = this.config.excludes || [];

  request(options)
    .then(data => {
      const swagger = parseSchemaToSwagger(
        parseBaseSwaggerSpec,
        data.results,
        excludes,
      );
      res.json(swagger);
    })
    .catch(error => {
      res.send('Request failed with response code ' + error.status);
    });
};

module.exports = ParseSwagger;
