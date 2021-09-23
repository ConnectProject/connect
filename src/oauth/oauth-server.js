const OAuth2Server = require('oauth2-server');

const OauthModel = require('./oauth-model');

const FIVE_MINUTES_IN_SECONDS = 5 * 60;
const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;
const ONE_YEAR_IN_SECONDS = ONE_MONTH_IN_SECONDS * 12;

module.exports = new OAuth2Server({
  model: OauthModel,
  authorizationCodeLifetime: FIVE_MINUTES_IN_SECONDS,
  accessTokenLifetime: ONE_MONTH_IN_SECONDS,
  refreshTokenLifetime: ONE_YEAR_IN_SECONDS,
  alwaysIssueNewRefreshToken: true,
  requireClientAuthentication: {
    authorization_code: true,
    refresh_token: true,
  },
});
