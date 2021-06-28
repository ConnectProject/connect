import Parse from 'parse';

const getOAuthApplication = async ({ clientId, redirectUri }) => {
  const application = await Parse.Cloud.run('oauth-get-application', {
    clientId,
    redirectUri,
  });

  return application;
};

const grantAccess = async ({ clientId, redirectUri }) => {
  const authorizationCode = await Parse.Cloud.run(
    'oauth-create-authorization-code',
    {
      clientId,
      redirectUri,
    },
  );

  return authorizationCode;
};

export default {
  getOAuthApplication,
  grantAccess,
};
