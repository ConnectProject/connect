/* eslint-disable */
const applicationModelMock = require(`${SPEC_PATH}/__mock__/applicationModel`);
const applicationNamingMock = require(`${SPEC_PATH}/__mock__/applicationNaming`);
const parseUserMock = require(`${SPEC_PATH}/__mock__/parseUser`);

jest.mock(`${SPEC_PATH}/../src/api/db/model`, () => {
  return {
    Application: jest.fn().mockImplementation(() => applicationModelMock),
  };
});
jest.mock(`${SPEC_PATH}/../src/api/services/application/naming`, () => jest.fn().mockImplementation(() => applicationNamingMock));
jest.mock('uuid/v4', () => jest.fn().mockReturnValue('uuidv4'));
jest.mock(`${SPEC_PATH}/../src/parse`, () => {
  return {
    User: jest.fn().mockImplementation(() => parseUserMock)
  }
})
const ApplicationService = require(`${SPEC_PATH}/../src/api/services/application`);

describe('Application Service', () => {
  beforeEach(() => { });

  afterEach(() => { });

  it('create an application', async () => {
    const input = {
      name: 'monApp',
      description: 'blabla',
      apple_store_link: 'http://apple.fr',
      google_market_link: 'http://google.fr'
    }

    applicationNamingMock.getUniqName.mockReturnValue('12345-monapp');
    applicationModelMock.save.mockReturnValue(Promise.resolve({
      developer: {
        _id: 1
      },
      name: input.name,
      description: input.description,
      parse_name: '12345-monapp',
      token: 'uuidv4',
      apple_store_link: input.apple_store_link,
      google_market_link: input.google_market_link,
    }))

    const applicationService = new ApplicationService();
    await applicationService.create({ _id: 1 }, input);

    expect(applicationModelMock.save).toHaveBeenCalledTimes(1);
    expect(parseUserMock.set).toBeCalledWith('username', '12345-monapp');
    expect(parseUserMock.set).toBeCalledWith('password', 'uuidv4');
    expect(parseUserMock.signUp).toHaveBeenCalledTimes(1);
  });
});
