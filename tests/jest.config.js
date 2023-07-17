const {defaults} = require('jest-config');

const config = {
  modulePathIgnorePatterns: ['<rootDir>/dist']
};

module.exports = config;

module.exports = {
  testMatch: ['**/*.test.js'],
};
