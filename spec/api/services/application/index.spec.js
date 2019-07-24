/* eslint-disable */
const applicationModelMock = require(`${SPEC_PATH}/__mock__/applicationModel`);
const applicationNamingMock = require(`${SPEC_PATH}/__mock__/applicationNaming`);
const parseMock = require(`${SPEC_PATH}/__mock__/parse`);

jest.mock(`${SPEC_PATH}/../src/api/db/model`, () => {
  return {
    Application: jest.fn().mockImplementation(() => applicationModelMock),
  };
});
jest.mock(`${SPEC_PATH}/../src/api/services/application/naming`, () => jest.fn().mockImplementation(() => applicationNamingMock));
jest.mock('uuid/v4', () => jest.fn().mockReturnValue('uuidv4'));
jest.mock(`${SPEC_PATH}/../src/parse`, () => parseMock)
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
    expect(parseMock.signUp).toBeCalledWith('12345-monapp', 'uuidv4');
    expect(parseMock.signUp).toBeCalledWith('12345-monapp', 'uuidv4', true);
  });
});
