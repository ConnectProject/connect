/* eslint-disable no-undef */

module.exports = {
  isRedirectUriValidity(redirectUri, validRedirectUris) {
    const allowedUris = validRedirectUris.split(',').map((elt) => elt.trim());
    if (!allowedUris.includes(redirectUri.trim())) {
      console.log('redirect uri not allowed', {
        validRedirectUris,
        redirectUri,
      });

      return false;
    }

    return true;
  },

  async getClient(clientId) {
    if (!clientId) {
      return null;
    }

    const client = await new Parse.Query('OAuthApplication')
      .equalTo('publicKey', clientId)
      .first({ useMasterKey: true });

    if (client) {
      return {
        id: client.id,
        name: client.get('name'),
        description: client.get('description'),
        redirectUris: client.get('redirectUris') ?? '',
        grants: ['authorization_code', 'refresh_token'],
      };
    }
  },

  async saveToken(token, client, user) {
    console.log('OAuth Model - saveToken', { token, client, user });

    let savedToken = await new Parse.Query('OAuthToken')
      .equalTo('applicationId', client.id)
      .equalTo('userId', user.id)
      .first({ useMasterKey: true });

    if (savedToken) {
      savedToken.set({
        accessToken: token.accessToken,
        accessTokenExpirationAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpirationAt: token.refreshTokenExpiresAt,
      });
    } else {
      const OAuthToken = Parse.Object.extend('OAuthToken');
      savedToken = new OAuthToken({
        accessToken: token.accessToken,
        accessTokenExpirationAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpirationAt: token.refreshTokenExpiresAt,
        userId: user.id,
        applicationId: client.id,
      });
    }
    savedToken = await savedToken.save(null, { useMasterKey: true });
    if (savedToken) {
      return {
        accessToken: savedToken.get('accessToken'),
        accessTokenExpiresAt: savedToken.get('accessTokenExpirationAt'),
        refreshToken: savedToken.get('refreshToken'),
        refreshTokenExpiresAt: savedToken.get('refreshTokenExpirationAt'),
        scope: [],
        client,
        user: { id: savedToken.get('userId') },
      };
    }
  },

  async getAccessToken(accessToken) {
    console.log('OAuth Model - getAccessToken', { accessToken });
    const token = await new Parse.Query('OAuthToken')
      .equalTo('accessToken', accessToken)
      .first({ useMasterKey: true });

    if (token) {
      const [client, user] = await Promise.all([
        new Parse.Query('OAuthApplication').get(token.get('applicationId'), {
          useMasterKey: true,
        }),
        new Parse.Query(Parse.User).get(token.get('userId'), {
          useMasterKey: true,
        }),
      ]);

      if (client && user) {
        return {
          accessToken: token.get('accessToken'),
          accessTokenExpiresAt: token.get('accessTokenExpirationAt'),
          client: {
            id: client.id,
            grants: ['authorization_code', 'refresh_token'],
          },
          user: { id: user.id },
        };
      }
    }
  },

  async getRefreshToken(refreshToken) {
    console.log('OAuth Model - getRefreshToken', { refreshToken });
    const token = await new Parse.Query('OAuthToken')
      .equalTo('refreshToken', refreshToken)
      .first({ useMasterKey: true });

    if (token) {
      const [client, user] = await Promise.all([
        new Parse.Query('OAuthApplication').get(token.clientId, {
          useMasterKey: true,
        }),
        new Parse.Query(Parse.User).get(token.userId, { useMasterKey: true }),
      ]);
      if (client && user) {
        return {
          refreshToken: token.get('refreshToken'),
          refreshTokenExpiresAt: token.get('refreshTokenExpirationAt'),
          client: {
            id: client.id,
            grants: ['authorization_code', 'refresh_token'],
          },
          user: { id: user.id },
        };
      }
    }
  },

  async revokeToken(token) {
    console.log('OAuth Model - revokeToken', { token });
    const foundCode = await new Parse.Query('OAuthToken')
      .equalTo('refreshToken', token.refreshToken)
      .first({ useMasterKey: true });
    if (foundCode) {
      await foundCode.destroy({ useMasterKey: true });
    }

    return true;
  },

  async saveAuthorizationCode(code, client, user) {
    console.log('OAuth Model - saveAuthorizationCode', { code, client, user });

    let authorizationCodeSaved = await new Parse.Query('OAuthAuthorizationCode')
      .equalTo('applicationId', client.id)
      .equalTo('userId', user.id)
      .first({ useMasterKey: true });

    if (authorizationCodeSaved) {
      authorizationCodeSaved.set({
        authorizationCode: code.authorizationCode,
        userId: user.id,
        applicationId: client.id,
        redirectUri: code.redirectUri,
        expiresAt: code.expiresAt,
      });
    } else {
      const OAuthAuthorizationCode = Parse.Object.extend(
        'OAuthAuthorizationCode',
      );
      authorizationCodeSaved = new OAuthAuthorizationCode({
        authorizationCode: code.authorizationCode,
        userId: user.id,
        applicationId: client.id,
        redirectUri: code.redirectUri,
        expiresAt: code.expiresAt,
      });
    }
    authorizationCodeSaved = await authorizationCodeSaved.save(null, {
      useMasterKey: true,
    });

    return {
      authorizationCode: authorizationCodeSaved.get('authorizationCode'),
      expiresAt: authorizationCodeSaved.get('expirationAt'),
      redirectUri: authorizationCodeSaved.get('redirectUri'),
      client,
      user: { id: authorizationCodeSaved.get('userId') },
    };
  },

  //see example at https://oauth2-server.readthedocs.io/en/latest/model/spec.html#getauthorizationcode-authorizationcode-callback
  async getAuthorizationCode(authorizationCode) {
    console.log('OAuth Model - getAuthorizationCode', { authorizationCode });
    const foundCode = await new Parse.Query('OAuthAuthorizationCode')
      .equalTo('authorizationCode', authorizationCode)
      .first({ useMasterKey: true });
    if (foundCode) {
      return {
        authorizationCode: foundCode.get('authorizationCode'),
        expiresAt: foundCode.get('expiresAt'),
        redirectUri: foundCode.get('redirectUri'),
        client: {
          id: foundCode.get('applicationId'),
          grants: ['authorization_code', 'refresh_token'],
        },
        user: { id: foundCode.get('userId') },
      };
    }
  },

  //see example at https://oauth2-server.readthedocs.io/en/latest/model/spec.html#revokeauthorizationcode-code-callback
  async revokeAuthorizationCode(authorizationCode) {
    console.log('OAuth Model - revokeAuthorizationCode', { authorizationCode });
    const foundCode = await new Parse.Query('OAuthAuthorizationCode')
      .equalTo('authorizationCode', authorizationCode.authorizationCode)
      .first({ useMasterKey: true });
    if (foundCode) {
      await foundCode.destroy({ useMasterKey: true });
    }

    return true;
  },

  verifyScope() {
    return true;
  },
};
