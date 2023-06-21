/* eslint-disable max-lines */
/* eslint-disable max-statements */
import Parse from 'parse/node';
import axios from 'axios';
import qs from 'qs';
import { bindAll } from './helper';
import config from './__mock__/config';

const { API_URL, PARSE_APP_ID } = config;

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
      redirectUris: 'http://localhost:9275/test',
      allowImplicitGrant: true
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
        redirectUris: 'http://localhost:9275/test, myawesomeapp://oauthresult',
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

    const notFoundCauseWrongRedirectUri = Parse.Cloud.run(
      'oauth-get-application',
      {
        clientId: application.publicKey,
        redirectUri: 'incorrectRedirectUri://thisshouldfail',
      },
      { sessionToken: endUser.getSessionToken() },
    );
    await expect(notFoundCauseWrongRedirectUri).rejects.toHaveProperty('code', 141);

    const notFoundCauseWrongClientId = Parse.Cloud.run(
      'oauth-get-application',
      {
        clientId: application.secretKey,
        redirectUri: 'http://localhost:9275/test',
      },
      { sessionToken: endUser.getSessionToken() },
    );

    await expect(notFoundCauseWrongClientId).rejects.toHaveProperty('code', 141);
  });

  const getAccessToken = async (username, password, fromApp = application) => {
    const user = await logAUser(username, password);

    const oAuthApplication = await Parse.Cloud.run(
      'oauth-get-application',
      {
        clientId: fromApp.publicKey,
        redirectUri: 'http://localhost:9275/test',
      },
      { sessionToken: user.getSessionToken() },
    );

    const redirection = await Parse.Cloud.run(
      'oauth-authorize-request',
      {
        client_id: fromApp.publicKey,
        redirect_uri: 'http://localhost:9275/test',
        response_type: 'code'
      },
      { sessionToken: user.getSessionToken() },
    );

    const authorizationCode = new URL(redirection).searchParams.get('code');

    // simulate confirmation by the app's backend
    const { data } = await axios.post(
      API_URL + '/oauth/token',
      qs.stringify({
        client_id: fromApp.publicKey,
        client_secret: fromApp.secretKey,
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: 'http://localhost:9275/test',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return { oAuthApplication, user, redirection, authorizationCode, accessToken: data };
  };

  it('perform nominal OAuth flow', async () => {
    const {
      oAuthApplication,
      redirection,
      authorizationCode,
      accessToken: data,
    } = await getAccessToken(
      credentials.endUser.email,
      credentials.endUser.password,
    );

    accessToken = data;

    expect(oAuthApplication).toEqual({
      id: application.objectId,
      name: application.name,
      description: application.description,
      redirectUri: 'http://localhost:9275/test',
      allowImplicitGrant: false
    });

    expect(authorizationCode.length).toBeGreaterThan(0);
    expect(redirection).toBe(`http://localhost:9275/test?code=${authorizationCode
      }`);

    expect(data.token_type).toBe('Bearer');
    expect(data.access_token.length).toBeGreaterThan(0);
    expect(data.refresh_token.length).toBeGreaterThan(0);
    expect(data.scope).toEqual([]);
    const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;
    expect(data.expires_in).toBeGreaterThan(ONE_MONTH_IN_SECONDS - 5);
  });

  it('GET the user id associated to the accessToken', async () => {
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

  const getAccessTokenImplicit = async (username, password, fromApp = application) => {
    const user = await logAUser(username, password);

    const redirection = await Parse.Cloud.run(
      'oauth-authorize-request',
      {
        client_id: fromApp.publicKey,
        redirect_uri: 'http://localhost:9275/test',
        response_type: 'token'
      },
      { sessionToken: user.getSessionToken() },
    );

    const token = new URL(redirection.replace('#', '?')).searchParams.get('access_token');

    return token;
  };

  it('cannot use implicit grant if not allowed by the application', async () => {
    const token = getAccessTokenImplicit(
      credentials.endUser.email,
      credentials.endUser.password,
      application,
    );

    await expect(token).rejects.toHaveProperty('code', 141);
  });

  it('perform implicit OAuth flow', async () => {
    const token = await getAccessTokenImplicit(
      credentials.endUser.email,
      credentials.endUser.password,
      application2,
    );

    const { data } = await axios.get(API_URL + '/oauth/user', {
      headers: { Authorization: 'Bearer ' + token },
    });
    expect(data.id).toBe(endUserUserId);
  });

  let createdGameScoreObjectId;
  let gameScoreObject;

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
      userId: endUserUserId,
    });

    createdGameScoreObjectId = data.objectId;
    gameScoreObject = data;
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
        'x-parse-application-id': PARSE_APP_ID,
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

  it('POST huge amount of data', async () => {
    const arraySize = 1000;
    const requestArray = Array.from({ length: arraySize }, (_, index) => ({
      method: 'POST',
      path: '/parse/classes/GameScore',
      body: { score: 1337 + index, playerName: 'ultimtester', cheatMode: false }
    }));
    const { data } = await axios({
      method: 'post',
      url: `${API_URL}/parse/batch`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
      },
      data: {
        requests: requestArray,
      },
    });

    expect(data.length).toBe(arraySize);
  });

  let createdSandboxGameScoreObjectId;
  let sandboxGameScoreObject;

  it('POST sandbox GameScore event', async () => {
    const { data } = await axios({
      method: 'post',
      url: `${API_URL}/parse/classes/GameScore`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
        'x-is-sandbox': true
      },
      data: { score: 1339, playerName: 'test0', cheatMode: true },
    });

    expect(data.createdAt).toBeDefined();
    expect(data.updatedAt).toBeDefined();
    expect(data.objectId).toBeDefined();

    expect(data).toEqual({
      objectId: data.objectId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      score: 1339,
      playerName: 'test0',
      cheatMode: true,
      applicationId: application.objectId,
      userId: endUserUserId,
    });

    createdSandboxGameScoreObjectId = data.objectId;
    sandboxGameScoreObject = data;
  });

  it('POST batch sandbox GameScore event', async () => {
    const { data } = await axios({
      method: 'post',
      url: `${API_URL}/parse/batch`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
        'x-is-sandbox': true
      },
      data: {
        requests: [
          {
            method: 'POST',
            path: '/parse/classes/GameScore',
            body: { score: 4945, playerName: 'tesergrgt', cheatMode: true },
          },
          {
            method: 'POST',
            path: '/parse/classes/GameScore',
            body: { score: 4946, playerName: 'tesergrgt', cheatMode: true },
          },
          {
            method: 'POST',
            path: '/parse/classes/GameScore',
            body: { score: 4947, playerName: 'zefzig', cheatMode: false },
          },
        ],
      },
    });

    expect(data.length).toBe(3);
    expect(data[0].success.score).toBe(4945);
    expect(data[1].success.score).toBe(4946);
    expect(data[2].success.score).toBe(4947);
  });

  it('GET sandbox GameScore event using OAuth', async () => {
    const { data } = await axios({
      method: 'get',
      url: `${API_URL}/parse/classes/GameScore/${createdSandboxGameScoreObjectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
        'x-is-sandbox': true
      },
    });
    expect(data).toEqual(sandboxGameScoreObject);
  });

  it('GET sandbox GameScore events using OAuth', async () => {
    const { data } = await axios({
      method: 'get',
      url: `${API_URL}/parse/classes/GameScore/`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
        'x-is-sandbox': true
      },
    });

    expect(data.results.length).toBe(4);
  });

  it('GET sandbox GameScore event without OAuth', async () => {
    const { data } = await axios({
      method: 'get',
      url: `${API_URL}/parse/classes/GameScore/${createdSandboxGameScoreObjectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        'x-parse-session-token': sessionToken,
        'x-is-sandbox': true
      },
    });

    expect(data).toEqual(sandboxGameScoreObject);
  });

  it('GET sandbox GameScore event without asking for sandbox should fail', async () => {
    expect.assertions(3);
    try {
      await axios({
        method: 'get',
        url: `${API_URL}/parse/classes/GameScore/${createdSandboxGameScoreObjectId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': PARSE_APP_ID,
          Authorization: 'Bearer ' + accessToken.access_token
        },
      });
    } catch (err) {
      expect(err.response.status).toEqual(404);
      expect(err.response.data.code).toEqual(101);
      expect(err.response.data.error).toBeDefined();
    }
  });

  it('GET non-sandbox GameScore event when asking for sandbox should fail', async () => {
    expect.assertions(3);
    try {
      await axios({
        method: 'get',
        url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': PARSE_APP_ID,
          Authorization: 'Bearer ' + accessToken.access_token,
          'x-is-sandbox': true
        },
      });
    } catch (err) {
      expect(err.response.status).toEqual(404);
      expect(err.response.data.code).toEqual(101);
      expect(err.response.data.error).toBeDefined();
    }
  });

  it('DELETE sandbox GameScore event', async () => {
    const { data } = await axios({
      method: 'delete',
      url: `${API_URL}/parse/classes/GameScore/${createdSandboxGameScoreObjectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
        'x-is-sandbox': true
      },
    });

    expect(data).toEqual({});
  });

  it('allow PUT GameScore event for the creator of the object', async () => {
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

    expect(data).toEqual({
      objectId: data.objectId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      score: 1338,
      playerName: 'test9',
      cheatMode: true,
      applicationId: application.objectId,
      userId: endUserUserId,
    });
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
          'x-parse-application-id': PARSE_APP_ID,
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
          'x-parse-application-id': PARSE_APP_ID,
        },
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('refuse DELETE GameScore event when creator on a different application', async () => {
    const { accessToken: accessTokenApp2 } = await getAccessToken(
      credentials.endUser.email,
      credentials.endUser.password,
      application2,
    );
    expect.assertions(1);
    try {
      await axios({
        method: 'delete',
        url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-parse-application-id': PARSE_APP_ID,
          Authorization: 'Bearer ' + accessTokenApp2.access_token,
        }
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('allow DELETE GameScore event for the creator on the same application', async () => {
    const { data } = await axios({
      method: 'delete',
      url: `${API_URL}/parse/classes/GameScore/${createdGameScoreObjectId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-parse-application-id': PARSE_APP_ID,
        Authorization: 'Bearer ' + accessToken.access_token,
      },
    });

    expect(data).toEqual({});
  });
});