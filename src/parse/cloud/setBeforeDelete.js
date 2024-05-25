/* eslint-disable complexity */

import { getOAuthUserFromRequest } from '../../oauth/oauth-service.js';
import getClasses from '../schema/getClasses.js';

export default async (Parse) => {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    Parse.Cloud.beforeDelete(schemaClass.className, async (req) => {
      // was used to check that the user requesting the deletion was the creator of the object
      // no longer used because deletion is now prevented by CLP
      if (req.master) {
        return;
      }
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
        req.object?.get('applicationId') &&
        req.object.get('applicationId') !== application.id
      ) {
        // trying to delete the object that was created with this user, but with another application. Forbidden.
        throw new Parse.Error(403, 'Please use OAuth to authenticate');
      }
    });
  }
};
