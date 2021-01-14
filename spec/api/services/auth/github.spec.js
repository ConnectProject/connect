const Github = require('../../../../src/api/services/auth/github');
const { bindGithub } = require('../../../helper');

bindGithub();

describe('Github Service', () => {
  it('get an access token', async () => {
    const accessToken = await Github.getAccessToken('anyOauthCode');
    expect(accessToken).toBe('test-access-token');
  });

  it('get an user', async () => {
    const githubUser = await Github.getUser('theAccessToken');
    expect(githubUser.login).toBe('user');
    expect(githubUser.id).toBe(1);
    expect(githubUser.company).toBe('tester');
    expect(githubUser.email).toBe('noreply@sample.fr');
  });
});
