import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
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
