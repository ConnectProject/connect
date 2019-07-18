module.exports = {
  findOne: jest.fn().mockReturnThis(),
  exec: jest.fn(() => Promise.resolve(null)),
};
