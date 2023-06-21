// fields properties have to be changed manually in mongo db so changes take effect
// for example: db.getCollection('_SCHEMA').update({_id:'OAuthToken'}, {$set: {'_metadata.fields_options.refreshToken.required': false}})
// https://community.parseplatform.org/t/is-there-any-way-i-can-update-a-schema-to-mark-a-field-as-required/1526/6

export default [
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
    fields: {},
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
      find: { '*': true, 'role:Developer': true, 'role:Administrator': true },
      get: { '*': true, 'role:Developer': true, 'role:Administrator': true },
      readUserFields: ['owner'],
      writeUserFields: ['owner'],
      create: { 'role:Developer': true },
      update: { 'role:Administrator': true },
      delete: { 'role:Administrator': true },
      protectedFields: {
        '*': ['publicKey', 'secretKey', 'redirectUris'],
        'userField:owner': [],
        'role:Administrator': [],
      },
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
      refreshToken: { type: 'String', required: false },
      refreshTokenExpirationAt: { type: 'Date', required: false },
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
