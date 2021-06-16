/* eslint-disable max-lines */
/* eslint-disable max-statements */
const Parse = require('parse/node');
const axios = require('axios');
const qs = require('qs');
const { bindAll } = require('./helper');
const { API_URL, PARSE_APP_ID } = require('./__mock__/config');

bindAll();

describe('Parse server', () => {
  const credentials = {
    developer: { email: 'developer@connect.com', password: 'IamAdEvl0p3r' },
    endUser: { email: 'normal@connect.com', password: 'JeSuisNormal' },
    anotherRandomUser: {
      email: 'random@connect.com',
      password: 'NormalSuisJe',
    },
  };

  let developerUserId;
  let endUserUserId;
  let anotherRandomUserId;
  let application;
  let application2;
  let accessToken;

  const logAUser = (username, password) => Parse.User.logIn(username, password);
  const logDeveloperIn = () =>
    logAUser(credentials.developer.email, credentials.developer.password);
  const logEndUserIn = () =>
    logAUser(credentials.endUser.email, credentials.endUser.password);

  beforeAll(() => {
    Parse.initialize(PARSE_APP_ID);
    Parse.serverURL = `${API_URL}/parse`;
  });

  it('create a user account', async () => {
    const developer = await Parse.User.signUp(
      credentials.developer.email,
      credentials.developer.password,
    );
    developerUserId = developer.id;
    expect(developerUserId.length).toBeGreaterThan(0);

    const endUser = await Parse.User.signUp(
      credentials.endUser.email,
      credentials.endUser.password,
    );
    endUserUserId = endUser.id;
    expect(endUserUserId.length).toBeGreaterThan(0);

    const anotherRandomUser = await Parse.User.signUp(
      credentials.anotherRandomUser.email,
      credentials.anotherRandomUser.password,
    );
    anotherRandomUserId = anotherRandomUser.id;
    expect(anotherRandomUserId.length).toBeGreaterThan(0);
  });

  it("cannot access other user's details", async () => {
    const developer = await logDeveloperIn();
    expect(developer.id).toBe(developerUserId);

    try {
      await new Parse.Query(Parse.User).get(endUserUserId, {
        sessionToken: developer.getSessionToken(),
      });
      expect.assertions(1);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  const Application = Parse.Object.extend('OAuthApplication');

  it('create an application', async () => {
    const developer = await logDeveloperIn();
    const newlyCreatedApp = new Application({
      name: 'Test App',
      description: 'The best app ever.',
    });
    await newlyCreatedApp.save(null, {
      sessionToken: developer.getSessionToken(),
    });

    expect(newlyCreatedApp).toBeDefined();
    application = newlyCreatedApp.toJSON();

    expect(application.name).toBe('Test App');
    expect(application.description).toBe('The best app ever.');

    const newlyCreatedApp2 = new Application({
      name: 'Another Test App',
      description: 'The worst app ever.',
      redirectUris: 'localhost:9275/test',
    });
    await newlyCreatedApp2.save(null, {
      sessionToken: developer.getSessionToken(),
    });
    application2 = newlyCreatedApp2.toJSON();
  });

  it('update an application', async () => {
    const developer = await logDeveloperIn();
    let appFromParse = await new Parse.Query(Application).get(
      application.objectId,
      { sessionToken: developer.getSessionToken() },
    );

    expect(appFromParse).toBeDefined();
    await appFromParse.save(
      {
        name: 'Test App v2',
        redirectUris: 'localhost:9275/test, myawesomeapp://oauthresult',
      },
      { sessionToken: developer.getSessionToken() },
    );

    appFromParse = await new Parse.Query(Application).get(
      application.objectId,
      { sessionToken: developer.getSessionToken() },
    );
    application = appFromParse.toJSON();
    expect(application.name).toBe('Test App v2');
  });

  it('fail oauth-get-application with wrong parameter', async () => {
    const endUser = await logEndUserIn();

    const notFoundCauseWrongRedirectUri = await Parse.Cloud.run(
      'oauth-get-application',
      {
        clientId: application.publicKey,
        redirectUri: 'incorrectRedirectUri://thisshouldfail',
      },
      { sessionToken: endUser.getSessionToken() },
    );
    expect(notFoundCauseWrongRedirectUri).toBeNull();

    const notFoundCauseWrongClientId = await Parse.Cloud.run(
      'oauth-get-application',
      {
        clientId: application.secretKey,
        redirectUri: 'localhost:9275/test',
      },
      { sessionToken: endUser.getSessionToken() },
    );

    expect(notFoundCauseWrongClientId).toBeNull();
  });

  const getAccessToken = async (username, password, fromApp = application) => {
    const user = await logAUser(username, password);

    const oAuthApplication = await Parse.Cloud.run(
      'oauth-get-application',
      {
        clientId: fromApp.publicKey,
        redirectUri: 'localhost:9275/test',
      },
      { sessionToken: user.getSessionToken() },
    );

    const authorizationCode = await Parse.Cloud.run(
      'oauth-create-authorization-code',
      {
        clientId: fromApp.publicKey,
        redirectUri: 'localhost:9275/test',
      },
      { sessionToken: user.getSessionToken() },
    );

    // simulate confirmation by the app's backend
    const { data } = await axios.post(
      API_URL + '/oauth/token',
      qs.stringify({
        client_id: fromApp.publicKey,
        client_secret: fromApp.secretKey,
        grant_type: 'authorization_code',
        code: authorizationCode.authorizationCode,
        redirect_uri: 'localhost:9275/test',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return { oAuthApplication, user, authorizationCode, accessToken: data };
  };

  it('perform nominal OAuth flow', async () => {
    const {
      oAuthApplication,
      authorizationCode,
      accessToken: data,
    } = await getAccessToken(
      credentials.endUser.email,
      credentials.endUser.password,
    );

    expect(oAuthApplication).toEqual({
      id: application.objectId,
      name: application.name,
      description: application.description,
      redirectUri: 'localhost:9275/test',
    });

    expect(authorizationCode.authorizationCode.length).toBeGreaterThan(0);
    expect(authorizationCode.redirectUri).toBe('localhost:9275/test');

    expect(data.token_type).toBe('Bearer');
    expect(data.access_token.length).toBeGreaterThan(0);
    expect(data.refresh_token.length).toBeGreaterThan(0);
    expect(data.scope).toEqual([]);
    const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;
    expect(data.expires_in).toBeGreaterThan(ONE_MONTH_IN_SECONDS - 5);

    accessToken = data;
  });

  it('GET valid OAuth accessToken', async () => {
    const { data } = await axios.get(API_URL + '/oauth/user', {
      headers: { Authorization: 'Bearer ' + accessToken.access_token },
    });
    expect(data.id).toBe(endUserUserId);
  });

  it('GET valid OAuth refreshToken', async () => {
    const { data } = await axios.post(
      API_URL + '/oauth/token',
      qs.stringify({
        client_id: application.publicKey,
        client_secret: application.secretKey,
        grant_type: 'refresh_token',
        refresh_token: accessToken.refresh_token,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    expect(data.access_token).not.toEqual(accessToken.access_token);
    expect(data.refresh_token).not.toEqual(accessToken.refresh_token);

    expect(data.token_type).toBe('Bearer');
    expect(data.access_token.length).toBeGreaterThan(0);
    expect(data.refresh_token.length).toBeGreaterThan(0);
    expect(data.scope).toEqual([]);
    const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;
    expect(data.expires_in).toBeGreaterThan(ONE_MONTH_IN_SECONDS - 5);

    accessToken = data;
  });

  let createdGameScoreObjectId;

  it('POST GameScore event', async () => {
    const { data } = await axios({
      method: 'post',
      url: `${API_URL}/parse/classes/GameScore`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
      },
      data: { score: 1337, playerName: 'test9', cheatMode: false },
    });

    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
    expect(data.objectId).toBeDefined();

    expect(data).toEqual({
      objectId: data.objectId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      score: 1337,
      playerName: 'test9',
      cheatMode: false,
      applicationId: application.objectId,
    });

    createdGameScoreObjectId = data.objectId;
  });

  it('POST batch GameScore event', async () => {
    const { data } = await axios({
      method: 'post',
      url: `${API_URL}/parse/batch`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
      },
      data: {
        requests: [
          {
            method: 'POST',
            path: '/parse/classes/GameScore',
            body: { score: 3945, playerName: 'tesergrgt9', cheatMode: true },
          },
          {
            method: 'POST',
            path: '/parse/classes/GameScore',
            body: { score: 3946, playerName: 'zefzeg', cheatMode: false },
          },
        ],
      },
    });

    expect(data.length).toBe(2);
    expect(data[0].success.score).toBe(3945);
    expect(data[1].success.score).toBe(3946);
  });

  let gameScoreObject;

  it('PUT GameScore event', async () => {
    const { data } = await axios({
      method: 'put',
      url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
      },
      data: { score: 1338, cheatMode: true },
    });

    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
    expect(data.objectId).toBeDefined();

    expect(data).toEqual({
      objectId: data.objectId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      score: 1338,
      playerName: 'test9',
      cheatMode: true,
      applicationId: application.objectId,
    });

    gameScoreObject = data;
  });

  it('GET GameScore event using OAuth', async () => {
    const { data } = await axios({
      method: 'get',
      url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
      },
    });
    expect(data).toEqual(gameScoreObject);
  });

  it('GET GameScore events using OAuth', async () => {
    const { data } = await axios({
      method: 'get',
      url: `${API_URL}/parse/classes/GameScore/`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
      },
    });

    expect(data.results.length).toBe(3);
  });

  let sessionToken;
  it('Get session token', async () => {
    const { data } = await axios({
      method: 'get',
      url: `${API_URL}/parse/login`,
      headers: {
        'x-parse-application-id': PARSE_APP_ID,
        'x-parse-revocable-session': '1',
      },
      data: {
        username: credentials.anotherRandomUser.email,
        password: credentials.anotherRandomUser.password,
      },
    });

    expect(data.sessionToken).toBeDefined();

    sessionToken = data.sessionToken;
  });

  it('GET GameScore event without OAuth', async () => {
    const { data } = await axios({
      method: 'get',
      url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': 'test',
        'x-parse-session-token': sessionToken,
      },
    });

    expect(data).toEqual(gameScoreObject);
  });

  it('GET GameScore events without OAuth', async () => {
    const { data } = await axios({
      method: 'get',
      url: `${API_URL}/parse/classes/GameScore`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        'x-parse-session-token': sessionToken,
      },
    });

    expect(data.results.length).toBe(3);
    expect(data.results[0]).toEqual(gameScoreObject);
  });

  it('refuse PUT GameScore event when owner on a different application', async () => {
    const { accessToken: accessTokenApp2 } = await getAccessToken(
      credentials.endUser.email,
      credentials.endUser.password,
      application2,
    );
    expect.assertions(1);
    try {
      await axios({
        method: 'put',
        url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': PARSE_APP_ID,
          Authorization: 'Bearer ' + accessTokenApp2.access_token,
        },
        data: { score: 1338, cheatMode: true },
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('refuse POST GameScore event when authenticated but not with OAuth', async () => {
    expect.assertions(1);
    try {
      await axios({
        method: 'post',
        url: `${API_URL}/parse/classes/GameScore`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': PARSE_APP_ID,
          'x-parse-session-token': sessionToken,
        },
        data: { score: 1337, playerName: 'test9', cheatMode: false },
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('refuse PUT GameScore event when authenticated but not with OAuth', async () => {
    expect.assertions(1);
    try {
      await axios({
        method: 'put',
        url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': PARSE_APP_ID,
          'x-parse-session-token': sessionToken,
        },
        data: { score: 1338, cheatMode: true },
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('refuse POST GameScore event when non authenticated', async () => {
    expect.assertions(1);
    try {
      await axios({
        method: 'post',
        url: `${API_URL}/parse/classes/GameScore`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': PARSE_APP_ID,
        },
        data: { score: 1337, playerName: 'test9', cheatMode: false },
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('refuse PUT GameScore event when non authenticated', async () => {
    expect.assertions(1);
    try {
      await axios({
        method: 'put',
        url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': PARSE_APP_ID,
        },
        data: { score: 1338, cheatMode: true },
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('refuse GET GameScore event when non authenticated', async () => {
    expect.assertions(1);
    try {
      await axios({
        method: 'get',
        url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': 'test',
        },
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('refuse GET GameScore events when non authenticated', async () => {
    expect.assertions(1);
    try {
      await axios({
        method: 'get',
        url: `${API_URL}/parse/classes/GameScore`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': 'test',
        },
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
