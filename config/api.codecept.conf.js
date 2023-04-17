const { merge } = require('lodash');

const { templateConfig } = require('./template.codecept.conf');

const config = merge(
  templateConfig,
  {
    tests: './tests/API/*.test.ts',
    plugins: {
      retryFailedStep: {
        enabled: false,
      },
    },
  }
);

module.exports = config;
