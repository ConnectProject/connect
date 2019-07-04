const logger = require('./../../logger');
const schemaSynch = require('../schema');

schemaSynch()
  .then(() => logger('Schema correctly loaded'))
  .catch(err => logger(`Issue to load schema : ${err}`));
