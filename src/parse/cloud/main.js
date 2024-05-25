import logger from '../../logger.js';
import roleInstall from '../role/install.js';
import schemaSync from '../schema/sync.js';

import initCloudFunctions from './functions/index.js';
import setAfterFind from './setAfterFind.js';
import setAfterSave from './setAfterSave.js';
import setBeforeDelete from './setBeforeDelete.js';
import setBeforeSave from './setBeforeSave.js';

const init = async function init (Parse) {
  await roleInstall();
  logger.info('Role correctly setup');

  await schemaSync();
  logger.info('Schema correctly sync');

  await setBeforeSave(Parse);
  await setAfterSave(Parse);
  await setBeforeDelete(Parse);
  await setAfterFind(Parse);

  await initCloudFunctions(Parse);
};

export default (Parse, event) => {
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
