const logger = require('./../../logger');
const schemaSync = require('../schema/sync');
const roleInstall = require('../role/install');
const roleGet = require('../role/get');
const setBeforeSave = require('./setBeforeSave');

async function init(Parse) {
  await roleInstall();
  logger('Role correctly setup');

  await schemaSync();
  logger('Schema correctly sync');

  await setBeforeSave(Parse);
}

init(Parse)
  .then(() => logger(`Parse correctly init`))
  .catch(err => logger(`Issue to init Parse : ${err}`));

Parse.Cloud.afterSave(Parse.User, async function(req) {
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
    return Parse.Promise.error('Role not install');
  }

  role.getUsers().add(user);
  return role.save(null, { useMasterKey: true });
});
