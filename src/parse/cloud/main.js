const logger = require('./../../logger');
const schemaSync = require('../schemaSync');

schemaSync()
  .then(() => logger('Schema correctly sync'))
  .catch(err => logger(`Issue to load schema : ${err}`));
