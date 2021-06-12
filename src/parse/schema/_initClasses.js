module.exports = [
  {
    className: '_Role',
    fields: {},
    classLevelPermissions: {
      find: {},
      get: {},
      create: {},
      update: {},
      delete: {},
      protectedFields: {},
    },
  },
  {
    className: '_User',
    fields: {
      applicationId: { type: 'String', required: false },
      endUserId: { type: 'String', required: false },
    },
    classLevelPermissions: {
      find: {},
      get: {},
      create: { '*': true },
      update: {},
      delete: {},
      protectedFields: {},
    },
  },
  {
    className: '_Session',
    fields: {},
    classLevelPermissions: {
      find: {},
      get: {},
      create: {},
      update: {},
      delete: {},
      protectedFields: {},
    },
  },
  {
    className: 'OAuthApplication',
    description: 'Application created by developers to allow access to data',
    fields: {
      name: { type: 'String', required: true },
      description: { type: 'String', required: true },
      owner: { type: 'Pointer', required: true, targetClass: '_User' },
      redirectUris: { type: 'String' },
      appleStoreLink: { type: 'String' },
      googleMarketLink: { type: 'String' },
      publicKey: { type: 'String' },
      secretKey: { type: 'String' },
    },
    required: ['name', 'description'],
    additionalProperties: false,
    classLevelPermissions: {
      find: {},
      get: {},
      readUserFields: ['owner'],
      writeUserFields: ['owner'],
      create: { 'role:Developer': true },
      update: { 'role:Administrator': true },
      delete: { 'role:Administrator': true },
      protectedFields: { '*': ['owner'], owner: [], 'role:Administrator': [] },
    },
  },
  {
    className: 'OAuthAuthorizationCode',
    description: 'Authorization Code to be confirmed during the OAuth flow',
    fields: {
      authorizationCode: { type: 'String', required: true },
      userId: { type: 'String', required: true },
      applicationId: { type: 'String', required: true },
      redirectUri: { type: 'String', required: true },
      expiresAt: { type: 'Date', required: true },
    },
    additionalProperties: false,
    classLevelPermissions: {
      find: {},
      get: {},
      readUserFields: [],
      writeUserFields: [],
      create: {},
      update: {},
      delete: {},
    },
  },
  {
    className: 'OAuthToken',
    description:
      'Tokens used by application to perform actions in the name of end users',
    fields: {
      accessToken: { type: 'String', required: true },
      accessTokenExpirationAt: { type: 'Date', required: true },
      refreshToken: { type: 'String', required: true },
      refreshTokenExpirationAt: { type: 'Date', required: true },
      userId: { type: 'String', required: true },
      applicationId: { type: 'String', required: true },
    },
    additionalProperties: false,
    classLevelPermissions: {
      find: {},
      get: {},
      readUserFields: [],
      writeUserFields: [],
      create: {},
      update: {},
      delete: {},
    },
  },
];
