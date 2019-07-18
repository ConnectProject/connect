const applicationModelMock = require('./../../../__mock__/applicationModel');
const Naming = require('./../../../../src/api/services/application/naming');

test('gen a parse name', () => {
  const namingService = new Naming({ applicationModel: applicationModelMock });
  const parseName = namingService.genParseName('toto');
  expect(parseName.length).toBe(11);
  expect(parseName).toEqual(expect.stringMatching(/^[a-zA-Z0-9]{6}\-toto$/));
});

test('gen an uniq parse name', async () => {
  applicationModelMock.exec.mockImplementationOnce(() =>
    Promise.resolve('first call'),
  );

  const namingService = new Naming({ applicationModel: applicationModelMock });
  const parseName = await namingService.getUniqName('toto');

  expect(parseName.length).toBe(11);
  expect(applicationModelMock.exec).toHaveBeenCalledTimes(2);
});
