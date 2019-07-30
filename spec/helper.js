/* eslint-disable */
const mongoose = require('mongoose');
const nock = require('nock');
const cache = require('parse-server/lib/cache').default;

const configMock = require('./__mock__/config');

// Set up a default API server for testing with default configuration.
let ConnectServer;
let server;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

// Allows testing specific configurations of Parse Server
const reconfigureServer = () => {
  return new Promise((resolve, reject) => {
    if (server) {
      return server.close(() => {
        server = undefined;
        reconfigureServer.then(resolve, reject);
      });
    }
    try {
      server = ConnectServer.start(configMock.APP_PORT);
      return resolve()
    } catch (error) {
      return reject(error);
    }
  });
};

function bindServer() {
  beforeAll(() => {
    const connectionName = `mongodb://localhost:46347/${process.env.TEST_SUITE}`;
    const parseConnect = mongoose.createConnection(connectionName);
    const apiConnect = mongoose.createConnection(
      `${connectionName}-api`,
    );
    const parseSandboxConnect = mongoose.createConnection(
      `${connectionName}-sandbox`,
    );

    jest.mock(`${SPEC_PATH}/../src/db/client`, () => {
      return () => {
        return {
          parseConnect,
          apiConnect,
          parseSandboxConnect,
        }
      }
    });
    configMock.MONGO_URI = connectionName;
    process.env = Object.assign(process.env, configMock);
    jest.mock(`${SPEC_PATH}/../src/config`, () => configMock);
    ConnectServer = require('./../src/connectServer');
  });

  afterAll(() => {
    mongoose.disconnect();
    if (server) {
      return server.close();
    }
  });

  beforeEach(() => {
    return reconfigureServer()
  });

  afterEach(() => {
    if (server) {
      server.close();
      cache.clear();
    }
  });
}

function bindGithub() {
  beforeEach(() => {
    nock(`https://github.com`)
      .persist()
      .post("/login/oauth/access_token")
      .reply(200, {
        access_token: "test-access-token",
      })

    nock(`https://api.github.com`)
      .persist()
      .get("/user")
      .reply(200, {
        login: 'user',
        id: 1,
        company: 'tester',
        email: 'noreply@sample.fr'
      })
  })

  afterEach(() => nock.cleanAll())
}

function bindAll() {
  bindServer()
  bindGithub()
}

async function getJwtToken() {
  const AuthService = require(`${SPEC_PATH}/../src/api/services/auth`);
  const authService = new AuthService();
  return authService.connectUser('lambda_github_code');
}

module.exports = {
  bindAll,
  bindServer,
  bindGithub,
  getJwtToken,
}