require('dotenv').config()

// Default to "dev" if NODE_ENV is not set
const env = process.env.NODE_ENV || "dev";

// For the test environment, load the "config.dev.js" file
const configModule = env === "test" ? "dev" : env;

// Load the appropriate configuration file based on the environment
const config = require(`./config.${configModule}.js`);

module.exports = config;
