/* eslint-disable complexity */

const fs = require('fs').promises;
const { Validator } = require('jsonschema');
const Config = require('parse-server/lib/Config');
const uuidv4 = require('uuid/v4');
const getClasses = require('../schema/getClasses');
const { getOAuthUserFromRequest } = require('../../oauth/oauth-service');

module.exports = async (Parse) => {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    // eslint-disable-next-line max-statements
    Parse.Cloud.beforeSave(schemaClass.className, async (req) => {
      if (!req.user) {
        // user is not authenticated, Forbidden.
        throw new Error('User should be authenticated.');
      }
      // authenticate end user using provided token
      const { client: application, user: endUser } =
        await getOAuthUserFromRequest({
          method: 'GET',
          query: {},
          headers: req.headers,
        });

      if (!application || !endUser) {
        throw new Parse.Error(
          401,
          'Please authenticate with OAuth before creating items',
        );
      }
      if (
        req.original?.get('applicationId') &&
        req.original.get('applicationId') !== application.id
      ) {
        // trying to update the object that was created with this user, but with another application. Forbidden.
        throw new Parse.Error(403, 'Please use OAuth to authenticate');
      }

      const schemaFile = `${__dirname}/../schema/classes/${schemaClass.className.replace(
        /^Sandbox_/,
        '',
      )}.schema.json`;
      const jsonObject = req.object.toJSON();
      // remove extra fields added by Parse to validate the JSON
      delete jsonObject.createdAt;
      delete jsonObject.updatedAt;
      delete jsonObject.objectId;
      delete jsonObject.applicationId;
      delete jsonObject.userId;
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

      req.object.set('userId', endUser.id);
      req.object.set('applicationId', application.id);

      const roleACL = new Parse.ACL();

      roleACL.setReadAccess(req.user, true);
      roleACL.setWriteAccess(req.user, true);
      roleACL.setRoleReadAccess('Developer', true);

      req.object.set('ACL', roleACL);
    });
  }

  Parse.Cloud.beforeSave('OAuthApplication', async (req) => {
    req.object.set('owner', req.user);

    const roleACL = new Parse.ACL();

    roleACL.setPublicReadAccess(true);
    roleACL.setPublicWriteAccess(false);
    roleACL.setWriteAccess(req.user, true);

    req.object.set('ACL', roleACL);

    const existingObject = req.object.id
      ? await new Parse.Query(Parse.Object.extend('OAuthApplication')).get(
        req.object.id,
        { useMasterKey: true },
      )
      : null;
    if (!existingObject || !existingObject.get('publicKey')) {
      req.object.set('publicKey', 'pub_' + uuidv4().replace(/-/g, ''));
    }
    if (!existingObject || !existingObject.get('secretKey')) {
      req.object.set('secretKey', 'sec_' + uuidv4().replace(/-/g, ''));
    }
  });

  Parse.Cloud.beforeSave('OAuthAuthorizationCode', (req) => {
    const acl = new Parse.ACL();

    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);

    req.object.set('ACL', acl);
  });

  Parse.Cloud.beforeSave('OAuthToken', (req) => {
    const acl = new Parse.ACL();

    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);

    req.object.set('ACL', acl);
  });
};
