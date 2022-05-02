import Parse from 'parse';

const getOAuthApplication = async ({ clientId, redirectUri }) => {
  const application = await Parse.Cloud.run('oauth-get-application', {
    clientId,
    redirectUri,
  });

  return application;
};

const authorize = async (params) => {
  const redirection = await Parse.Cloud.run(
    'oauth-authorize-request',
    params,
  );

  return redirection;
};

export default {
  getOAuthApplication,
  authorize
};
