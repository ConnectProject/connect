const logger = require('../../logger');
const schemaSync = require('../schema/sync');
const roleInstall = require('../role/install');
const setBeforeSave = require('./setBeforeSave');
const setAfterSave = require('./setAfterSave');
const setAfterFind = require('./setAfterFind');
const initCloudFunctions = require('./functions');

const init = async function (Parse) {
  await roleInstall();
  logger.info('Role correctly setup');

  await schemaSync(Parse.applicationId);
  logger.info('Schema correctly sync');

  await setBeforeSave(Parse);
  await setAfterSave(Parse);
  await setAfterFind(Parse);

  await initCloudFunctions(Parse);
};

module.exports = (Parse, event) => {
  init(Parse)
    .then(() => {
      if (event) {
        event.emit('parse-init', Parse);
      }
      logger.info(`Parse correctly init`);
    })
    .catch((err) => {
      logger.error(`Issue to init Parse : ${err}`);
      throw err;
    });
};
