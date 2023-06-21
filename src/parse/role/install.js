/* global Parse */

import roleGet from './get.js';

export default async () => {
  const roleACL = new Parse.ACL();
  roleACL.setPublicReadAccess(true);

  if (!(await roleGet.getOne('Administrator'))) {
    const adminRole = new Parse.Role('Administrator', roleACL);
    adminRole.save(null, { useMasterKey: true });
  }

  if (!(await roleGet.getOne('Developer'))) {
    const devRole = new Parse.Role('Developer', roleACL);
    devRole.save(null, { useMasterKey: true });
  }
};
