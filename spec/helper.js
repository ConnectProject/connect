/* eslint-disable */
const mongoose = require('mongoose');
const nock = require('nock');
const getClasses = require(`${SPEC_PATH}/../src/parse/schema/getClasses`);
const { EventEmitter } = require('events');

const configMock = require('./__mock__/config');

// Set up a default API server for testing with default configuration.
let ConnectServer;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

const Parse = require('parse/node');
Parse.serverURL = 'http://localhost:3000/parse';

function bindServer() {
  let server;
  let parse;

  // Allows testing specific configurations of Parse Server
  const reconfigureServer = () => {
    return new Promise((resolve, reject) => {
      if (server) {
        return server.server.close(() => {
          server = undefined;
          reconfigureServer().then(resolve, reject);
        });
      }
      try {
        const event = new EventEmitter();
        ConnectServer.start(configMock.APP_PORT, event).then(
          (connectServer) => {
            server = connectServer;
            let expressFinish = false;
            let parseInit = false;

            event.once('parse-init', function (Parse) {
              parse = Parse;
              parseInit = true;
              if (parseInit && expressFinish) {
                resolve();
              }
            });

            server.server.once('listening', function () {
              expressFinish = true;

              if (parseInit && expressFinish) {
                resolve();
              }
            });
          },
        );
      } catch (error) {
        return reject(error);
      }
    });
  };

  beforeAll(async () => {
    process.env.TESTING = true;
    const connectionName = `mongodb://localhost:46347/${process.env.TEST_SUITE}`;
    const parseConnect = mongoose.createConnection(connectionName);
    const apiConnect = mongoose.createConnection(`${connectionName}-api`);
    const parseSandboxConnect = mongoose.createConnection(
      `${connectionName}-sandbox`,
    );

    jest.mock(`${SPEC_PATH}/../src/db/client`, () => {
      return () => {
        return {
          parseConnect,
          apiConnect,
          parseSandboxConnect,
        };
      };
    });
    configMock.MONGO_URI = connectionName;
    process.env = Object.assign(process.env, configMock);
    jest.mock(`${SPEC_PATH}/../src/config`, () => configMock);

    await getClasses();
    ConnectServer = require('./../src/connectServer');
  });

  afterAll(() => {
    mongoose.disconnect().then(() => {
      if (server) {
        return server.server.close();
      }
    });
  });

  beforeEach(() => {
    return reconfigureServer();
  });

  afterEach(async () => {
    return new Promise((resolve) => {
      if (!server) {
        resolve();
      }

      parse.Cloud._removeAllHooks();
      server.server.close(() => {
        server = undefined;
        resolve();
      });
    });
  });
}

function bindGithub() {
  beforeEach(() => {
    nock(`https://github.com`)
      .persist()
      .post('/login/oauth/access_token')
      .reply(200, {
        access_token: 'test-access-token',
      });

    nock(`https://api.github.com`).persist().get('/user').reply(200, {
      login: 'user',
      id: 1,
      company: 'tester',
      email: 'noreply@sample.fr',
    });
  });

  afterEach(() => nock.cleanAll());
}

function bindAll() {
  bindServer();
  bindGithub();
}

async function getJwtToken() {
  const AuthService = require(`${SPEC_PATH}/../src/api/services/auth`);
  const authService = new AuthService();
  return await authService.connectUser('lambda_github_code');
}

module.exports = {
  bindAll,
  bindServer,
  bindGithub,
  getJwtToken,
};
