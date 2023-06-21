export default (Parse) => {
  Parse.Cloud.define('get-granted-tokens', async (request) => {
    if (!request.user) {
      return [];
    }

    const tokens = await new Parse.Query(Parse.Object.extend('OAuthToken'))
      .equalTo('userId', request.user.id)
      .findAll({ useMasterKey: true });

    const applicationIds = tokens.reduce((agg, elt) => {
      if (!agg.includes(elt.applicationId)) {
        agg.push(elt.applicationId);
      }

      return agg;
    }, []);

    const applications =
      applicationIds.length === 0
        ? []
        : await new Parse.Query(Parse.Object.extend('OAuthApplication'))
          .containedIn('id', applicationIds)
          .findAll({ useMasterKey: true });

    return tokens.map((elt) => {
      const app = applications.find((a) => a.id === elt.get('applicationId'));

      return {
        id: elt.id,
        application: {
          id: app.id,
          name: app.get('name'),
          description: app.get('description'),
        },
        grantedAt: elt.get('createdAt'),
      };
    });
  });

  Parse.Cloud.define('revoke-token', async (request) => {
    if (!request.user) {
      throw new Parse.Error(401, 'Not authenticated');
    }
    if ((request.params.id || '').trim().length === 0) {
      throw new Parse.Error(400, 'Bad request');
    }

    const token = await new Parse.Query(Parse.Object.extend('OAuthToken'))
      .equalTo('objectId', request.params.id)
      .equalTo('userId', request.user.id)
      .first({ useMasterKey: true });

    if (!token) {
      throw new Parse.Error(404, 'Not found');
    }

    await token.destroy({ useMasterKey: true });

    return { ok: true };
  });
};
