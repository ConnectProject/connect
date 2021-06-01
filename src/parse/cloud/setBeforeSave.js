const fs = require('fs').promises;
const { Validator } = require('jsonschema');
const Config = require('parse-server/lib/Config');
const uuidv4 = require('uuid/v4');
const getClasses = require('../schema/getClasses');

module.exports = async (Parse) => {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    // eslint-disable-next-line max-statements
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
      delete jsonObject.ACL;

      // convert Parse dates in iso format
      for (const field of Object.keys(jsonObject)) {
        if (jsonObject[field].__type === 'Date') {
          jsonObject[field] = jsonObject[field].iso;
        }
      }

      const v = new Validator();
      const schema = JSON.parse(await fs.readFile(schemaFile));
      const res = v.validate(jsonObject, schema);
      if (res.errors.length) {
        throw new Error(res.errors[0].stack);
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

  Parse.Cloud.beforeSave('OAuthApplication', (req) => {
    req.object.set('owner', req.user);

    const roleACL = new Parse.ACL();

    roleACL.setReadAccess(req.user, true);
    roleACL.setWriteAccess(req.user, true);

    req.object.set('ACL', roleACL);

    if (!req.object.get('publicKey')) {
      req.object.set('publicKey', 'pub_' + uuidv4().replace(/-/g, ''));
    }
    if (!req.object.get('secretKey')) {
      req.object.set('secretKey', 'sec_' + uuidv4().replace(/-/g, ''));
    }
  });
};
