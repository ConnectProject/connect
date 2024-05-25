import axios from 'axios';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../../config/index.js';

export default (Parse) => {
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
