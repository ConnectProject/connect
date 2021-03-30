const fs = require('fs');
const { Validator } = require('jsonschema');
const Config = require('parse-server/lib/Config');
const getClasses = require('../schema/getClasses');

module.exports = async (Parse) => {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    Parse.Cloud.beforeSave(schemaClass.className, async (req) => {
      if (!req.user) {
        // how can this happen and what's the expected behavior to make a return at this point?
        return;
      }

      const schemaFile = `${__dirname}/../schema/classes/${schemaClass.className}.schema.json`;
      const jsonObject = req.object.toJSON();
      // remove extra fields added by Parse to validate the JSON
      delete jsonObject.createdAt;
      delete jsonObject.updatedAt;
      delete jsonObject.objectId;

      const v = new Validator();
      const schema = JSON.parse(fs.readFileSync(schemaFile));
      const res = v.validate(jsonObject, schema);
      if (res.errors.length) {
        throw res.errors[0].stack;
      }

      // convert dates in Parse format
      const appId = req.headers['x-parse-application-id'];
      const parseSchema = await Config.get(appId).database.loadSchema();
      const actualSchemaClass = parseSchema.schemaData[schemaClass.className];
      for (const field of Object.keys(jsonObject)) {
        if (actualSchemaClass.fields[field].type === 'Date') {
          req.object.set(field, new Date(jsonObject[field]));
        }
      }

      req.object.set('owner', req.user);

      const roleACL = new Parse.ACL();
      roleACL.setWriteAccess(req.user, true);
      roleACL.setRoleReadAccess('Developer', true);

      req.object.set('ACL', roleACL);
    });
  }
};
