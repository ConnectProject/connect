/* eslint-disable */
const axios = require('axios');
const { bindAll, getJwtToken } = require(`${SPEC_PATH}/helper`);

process.env.TEST_SUITE = 'parse-custom-server';

describe('parse custom server', () => {
  bindAll();

  let sessionToken;
  let objectId;

  it('Get Token', async () => {
    const jwtToken = await getJwtToken();

    const response = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/application',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: 'toto',
        description: 'truc',
        apple_store_link: 'https://apple.fr',
        google_market_link: 'https://google.fr',
      },
    });

    const parseResponse = await axios({
      method: 'get',
      url: 'http://localhost:3000/parse/login',
      headers: {
        'x-parse-application-id': `test`,
        'x-parse-revocable-session': '1',
      },
      data: {
        username: response.data.parse_name,
        password: response.data.token,
      },
    });

    expect(parseResponse.data.sessionToken).toBeDefined();
    expect.assertions(1);

    sessionToken = parseResponse.data.sessionToken;
  });

  it('Create Item', async () => {
    const parseResponse = await axios({
      method: 'post',
      url: 'http://localhost:3000/parse/classes/GameScore',
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': `test`,
        'x-parse-session-token': sessionToken,
      },
      data: {
        score: 1337,
        playerName: 'test9',
        cheatMode: false,
      },
    });

    expect(parseResponse.data.score).toBe(1337);
    expect(parseResponse.data.playerName).toBe('test9');
    expect(parseResponse.data.cheatMode).toBe(false);
    expect(parseResponse.data.createdAt).toBeDefined();
    expect(parseResponse.data.updatedAt).toBeDefined();
    expect(parseResponse.data.objectId).toBeDefined();
    expect(parseResponse.data.ACL).toBeUndefined();
    expect(parseResponse.data.owner).toBeUndefined();
    expect.assertions(8);

    objectId = parseResponse.data.objectId;
  });

  it('Get Items', async () => {
    const parseResponse = await axios({
      method: 'get',
      url: 'http://localhost:3000/parse/classes/GameScore',
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': `test`,
        'x-parse-session-token': sessionToken,
      },
    });

    expect(parseResponse.data.results.length).toBe(1);
    expect(parseResponse.data.results[0].playerName).toBe('test9');
    expect(parseResponse.data.results[0].objectId).toBe(objectId);
    expect(parseResponse.data.results[0].ACL).toBeUndefined();
    expect(parseResponse.data.results[0].owner).toBeUndefined();
    expect.assertions(5);
  });

  it('Get Item', async () => {
    const parseResponse = await axios({
      method: 'get',
      url: `http://localhost:3000/parse/classes/GameScore/${objectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': `test`,
        'x-parse-session-token': sessionToken,
      },
    });

    expect(parseResponse.data.playerName).toBe('test9');
    expect(parseResponse.data.objectId).toBe(objectId);
    expect(parseResponse.data.ACL).toBeUndefined();
    expect(parseResponse.data.owner).toBeUndefined();
    expect.assertions(4);
  });

  it('Update Item', async () => {
    const parseResponse = await axios({
      method: 'put',
      url: `http://localhost:3000/parse/classes/GameScore/${objectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': `test`,
        'x-parse-session-token': sessionToken,
      },
      data: {
        cheatMode: true,
      },
    });

    expect(parseResponse.data.cheatMode).toBe(true);
    expect(parseResponse.data.ACL).toBeUndefined();
    expect(parseResponse.data.owner).toBeUndefined();
    expect.assertions(3);
  });
});
