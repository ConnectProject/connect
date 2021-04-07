/* eslint-disable no-undef */
const logger = require('../../logger');
const schemaSync = require('../schema/sync');
const roleInstall = require('../role/install');
const roleGet = require('../role/get');
const setBeforeSave = require('./setBeforeSave');
const setAfterSave = require('./setAfterSave');
const setAfterFind = require('./setAfterFind');

async function init(Parse) {
  await roleInstall();
  logger.info('Role correctly setup');

  await schemaSync(Parse.applicationId);
  logger.info('Schema correctly sync');

  await setBeforeSave(Parse);
  await setAfterSave(Parse);
  await setAfterFind(Parse);
}

module.exports = (Parse, event) => {
  Parse.Cloud.afterSave(Parse.User, async (req) => {
    if (req.object.existed()) {
      return;
    }

    const user = req.object;
    const acl = new Parse.ACL(user);
    acl.setReadAccess(user, true);
    acl.setWriteAccess(user, false);
    user.setACL(acl);

    await user.save({}, { useMasterKey: true });
    const role = await roleGet.getOne('Developer');

    if (!role) {
      throw new Error('Role not installed');
    }

    role.getUsers().add(user);
    role.save(null, { useMasterKey: true });
  });

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
