const schemaInstall = require('./../parse/schema');
const logger = require('./../logger');

schemaInstall()
  .then(() => {
    logger('Parse schema updated');
  })
  .catch(error => {
    logger(error);
  });
