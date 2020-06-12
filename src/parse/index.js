const axios = require('axios');
const {
  PARSE_APP_ID,
  PARSE_MASTER_KEY,
  API_URL,
  SANDBOX_URL,
} = require('./../config');

class Parse {
  static async signUp(username, password, isSandbox) {
    const parseUrl = isSandbox
      ? `${SANDBOX_URL}/parse-sandbox`
      : `${API_URL}/parse`;
    const parseApi = isSandbox ? `${PARSE_APP_ID}-sandbox` : PARSE_APP_ID;

    const response = await axios({
      method: 'post',
      url: `${parseUrl}/users`,
      data: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Parse-Application-Id': parseApi,
        'X-Parse-Revocable-Session': 1,
        'X-Parse-Master-Key': PARSE_MASTER_KEY,
      },
    });

    return response.data;
  }
}

module.exports = Parse;
