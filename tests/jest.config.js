const { defaults } = require("jest-config");

module.exports = {
  ...defaults,
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  testMatch: ["**/*.test.js"],
  // Jest uses the Node.js environment when running tests
  testEnvironment: "node",
  // Ensure that the variables are loaded before running the tests
  setupFiles: ["./tests.setup.js"],
};
