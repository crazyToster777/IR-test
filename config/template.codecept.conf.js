const pages = require('../pages');

const templateConfig = {
  name: 'tests',
  output: '../web/output',
  fullPromiseBased: true,
  include: {
    I: './stepsFile.ts',
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
      require: '../web/helpers/assertHelper.ts',
    },
    REST: {
      endpoint: 'https://api.independentreserve.com',
      prettyPrintJson: true,
    },
    JSONResponse: {},
    VisualHelper: {
      require: '../web/helpers/visualHelper.ts',

      dirExpected: '../web/tests/output/',
      dirDiff: '../web/tests/output/',
      dirActual: '../web/tests/output/',

      captureActual: true,
      captureExpected: false,
    },

  },
};

module.exports = {
  templateConfig,
};
