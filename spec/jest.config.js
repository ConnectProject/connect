module.exports = {
  transform: {},
  rootDir: '../',
  roots: ['<rootDir>/src/', '<rootDir>/spec/'],
  coverageDirectory: 'spec/coverage',
  collectCoverageFrom: [
    '!<rootDir>/src/front/**/*.js',
    '<rootDir>/src/**/*.js',
  ],
  globals: {
    SPEC_PATH: __dirname,
  },
  preset: '@shelf/jest-mongodb',
  testTimeout: 240000,
};
