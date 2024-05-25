import roleGet from '../role/get.js';
import getClasses from '../schema/getClasses.js';

export default async (Parse) => {
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

  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    Parse.Cloud.afterSave(schemaClass.className, (req) => {
      const jsonObject = req.object.toJSON();
      delete jsonObject.ACL;

      // re-convert dates in JSON format
      for (const field of Object.keys(jsonObject)) {
        if (jsonObject[field].__type === 'Date') {
          jsonObject[field] = jsonObject[field].iso;
        }
      }

      return jsonObject;
    });
  }
};
