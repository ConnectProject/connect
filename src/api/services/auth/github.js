const axios = require('axios');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require('./../../../config');

class Github {
  static async getAccessToken(code) {
    const response = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      data: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    return response.data.access_token;
  }

  static async getUser(token) {
    const response = await axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: { Authorization: `token ${token}`, Accept: 'application/json' },
    });

    return response.data;
  }
}

module.exports = new Github();
