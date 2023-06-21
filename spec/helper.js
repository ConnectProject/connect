import mongoose from 'mongoose';
import nock from 'nock';
import { EventEmitter, once } from 'events';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';

import configMock from './__mock__/config';

process.env = Object.assign(process.env, configMock);
// jest.mock('../src/config', () => configMock);
jest.unstable_mockModule('../src/config', () => configMock);

// Set up a default API server for testing with default configuration.
const ConnectServer = (await import('../src/connectServer')).default;

const bindServer = function () {
  let server;

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeAll(async () => {
    const event = new EventEmitter();
    server = await ConnectServer.start(configMock.APP_PORT, event);
    await once(event, 'parse-init');
  });

  afterAll(async () => {
    if (server) {
      await server.server.close();
      server = null;
    }
  });
};

const bindGithub = function () {
  beforeAll(() => {
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

  afterAll(() => nock.cleanAll());
};

const bindAll = function () {
  bindServer();
  bindGithub();
};

export {
  bindAll,
  bindServer,
  bindGithub,
};
