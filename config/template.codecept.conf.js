const pages = require('../pages');

const templateConfig = {
  name: 'tests',
  output: './output',
  fullPromiseBased: true,
  include: {
    I: './stepsFile.ts',
    factory: './factory/index.ts',
    ...pages.default,

  },
  plugins: {
    allure: { enabled: true },
    retryFailedStep: {
      enabled: true,
      retries: 3,
      ignoredSteps: ['saveScreenshot', /.*VisualDiff.*/, /.*Api.*/],
    },
    retryTo: {
      enabled: true,
    },
    tryTo: { enabled: true },
  },
  helpers: {
    AssertHelper: {
      require: './helpers/assertHelper.ts',
    },
    REST: {
      endpoint: 'https://api.independentreserve.com',
      prettyPrintJson: true,
    },
    JSONResponse: {},
    VisualHelper: {
      require: './helpers/visualHelper.ts',

      dirExpected: './tests/output/',
      dirDiff: './tests/output/',
      dirActual: './tests/output/',

      captureActual: true,
      captureExpected: false,
    },

  },
};

module.exports = {
  templateConfig,
};
