/* eslint-disable */
const axiosMock = jest.fn()
jest.mock('axios', () => axiosMock);
const Github = require(`${SPEC_PATH}/../src/api/services/auth/github`);

describe('Github Service', () => {
  beforeEach(() => { });

  afterEach(() => { });

  it('get an access token', async () => {
    axiosMock.mockReturnValue({
      data: {
        access_token: 'theAccessToken'
      }
    })

    const accessToken = await Github.getAccessToken('anyOauthCode');
    expect(accessToken).toBe('theAccessToken');
  });

  it('get an user', async () => {
    axiosMock.mockReturnValue({
      data: {
        name: 'githubName'
      }
    })

    const githubUser = await Github.getUser('theAccessToken');
    expect(githubUser.name).toBe('githubName');
  });
});
