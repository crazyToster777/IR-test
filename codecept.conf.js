require('ts-node/register');
require('tsconfig-paths/register');
require('dotenv').config();

const configFile = `./config/${process.env.CONFIG || 'local'}.codecept.conf`;
console.log('=== configFile: ', configFile);

// eslint-disable-next-line import/no-dynamic-require, global-require
const config = require(configFile);

console.log('=== testConfig', JSON.stringify(config));

module.exports = {
  config,
};
