/* global Parse */

const { getOne } = require('./get');

module.exports = async () => {
  const roleACL = new Parse.ACL();
  roleACL.setPublicReadAccess(true);

  if (!(await getOne('Administrator'))) {
    const adminRole = new Parse.Role('Administrator', roleACL);
    adminRole.save(null, { useMasterKey: true });
  }

  if (!(await getOne('Developer'))) {
    const devRole = new Parse.Role('Developer', roleACL);
    devRole.save(null, { useMasterKey: true });
  }
};
