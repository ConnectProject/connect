const axios = require('axios');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require('../../../config');

module.exports = (Parse) => {
  Parse.Cloud.define('get-github-auth-data', async (request) => {
    const result = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        code: request.params.code,
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
      },
      {
        headers: { Accept: 'application/json' },
      },
    );

    const { access_token: accessToken } = result.data;
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/json',
      },
    });

    return {
      id: userResponse.data.id,
      email: userResponse.data.email,
      access_token: accessToken,
    };
  });
};
