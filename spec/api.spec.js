const axios = require('axios');
const { bindAll, getJwtToken } = require('./helper');
const { API_URL } = require('./__mock__/config');

bindAll();

describe('api server', () => {
  let jwtToken;
  let applicationId;

  it('Get JSON web token', async () => {
    jwtToken = await getJwtToken();

    expect(jwtToken).toBeDefined();
    expect.assertions(1);
  });

  it('Create Application', async () => {
    const response = await axios({
      method: 'post',
      url: `${API_URL}/api/application`,
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

    expect(response.data.name).toBe('toto');
    expect(response.data.description).toBe('truc');
    expect(response.data.apple_store_link).toBe('https://apple.fr');
    expect(response.data.google_market_link).toBe('https://google.fr');
    expect(response.data.token).toBeDefined();
    expect(response.data.parse_name).toBeDefined();
    expect.assertions(6);

    applicationId = response.data._id;
  });

  it('List Application', async () => {
    const response = await axios({
      method: 'get',
      url: `${API_URL}/api/application`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(response.data.length).toBe(1);
    expect(response.data[0].name).toBe('toto');
  });

  it('Get Application', async () => {
    const getResponse = await axios({
      method: 'get',
      url: `${API_URL}/api/application/${applicationId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(getResponse.data.name).toBe('toto');
    expect.assertions(1);
  });

  it('Update Application', async () => {
    const response = await axios({
      method: 'put',
      url: `${API_URL}/api/application/${applicationId}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: 'toto-u',
        description: 'truc-u',
        apple_store_link: 'https://apple-u.fr',
        google_market_link: 'https://google-u.fr',
      },
    });

    expect(response.data.name).toBe('toto-u');
    expect(response.data.description).toBe('truc-u');
    expect(response.data.apple_store_link).toBe('https://apple-u.fr');
    expect(response.data.google_market_link).toBe('https://google-u.fr');
    expect.assertions(4);
  });

  it('Delete Developer', async () => {
    const response = await axios({
      method: 'delete',
      url: `${API_URL}/api/developer`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(response.data.length).toBe(3);
    expect(response.data[0].length > 0).toBe(true);
    expect(response.data[1].deletedCount).toBe(1);
    expect(response.data[2].deletedCount).toBe(1);
    expect.assertions(4);
  });
});

describe('parse custom server', () => {
  let sessionToken;
  let objectId;

  it('Get session token', async () => {
    const jwtToken = await getJwtToken();

    const response = await axios({
      method: 'post',
      url: `${API_URL}/api/application`,
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
      url: `${API_URL}/parse/login`,
      headers: {
        'x-parse-application-id': 'test',
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
      url: `${API_URL}/parse/classes/GameScore`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': 'test',
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
      url: `${API_URL}/parse/classes/GameScore`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': 'test',
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
      url: `${API_URL}/parse/classes/GameScore/${objectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': 'test',
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
      url: `${API_URL}/parse/classes/GameScore/${objectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': 'test',
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
