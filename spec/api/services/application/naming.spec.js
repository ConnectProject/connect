/* eslint-disable */
const applicationModelMock = require(`${SPEC_PATH}/__mock__/applicationModel`);
const configMock = require(`${SPEC_PATH}/__mock__/config`);

jest.mock(`${SPEC_PATH}/../src/config`, () => configMock);
jest.mock(`${SPEC_PATH}/../src/db/model`, () => {
  return () => {
    return {
      Application: applicationModelMock,
    };
  };
});
const Naming = require(`${SPEC_PATH}/../src/api/services/application/naming`);

describe('Application Naming Service', () => {
  it('gen a parse name', () => {
    const parseName = Naming.genParseName('toto');
    expect(parseName.length).toBe(11);
    expect(parseName).toEqual(expect.stringMatching(/^[a-zA-Z0-9]{6}\-toto$/));
  });

  it('gen an uniq parse name', async () => {
    applicationModelMock.exec.mockImplementationOnce(() =>
      Promise.resolve('first call'),
    );

    const namingService = new Naming();
    const parseName = await namingService.getUniqName('toto');

    expect(parseName.length).toBe(11);
    expect(applicationModelMock.exec).toHaveBeenCalledTimes(2);
  });
});
