/* eslint-disable */
const applicationModelMock = require('./../../../__mock__/applicationModel');
const quibble = require('quibble');

describe('Application Naming Service', () => {
  let Naming;
  beforeEach(() => {
    quibble('./../../../../src/api/db/model', {
      Application: applicationModelMock,
    });
    Naming = require('./../../../../src/api/services/application/naming');
  });

  afterEach(() => {});

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
    // have to make quibble work, it don't seem to alter the required
    // expect(applicationModelMock.exec).toHaveBeenCalledTimes(2);
  });
});
