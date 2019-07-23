module.exports = {
  findOneAndUpdate: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  exec: jest.fn(() => Promise.resolve(null)),
  save: jest.fn(),
};
