const { merge } = require('lodash');
const { devices } = require('playwright');

const { templateConfig } = require('./template.codecept.conf');

const config = merge(
  templateConfig,
  {
    tests: '../web/tests/mobile/*.test.ts',
    helpers: {
      Playwright: {
        url: process.env.BASE_URL,
        browser: 'webkit', // chromium|webkit
        show: (process.env.SHOW === 'true'), // default is false
        trace: (process.env.TRACE === 'true'), // default is false
        locale: 'en-US',
        emulate: { ...devices['iPhone 12'], deviceScaleFactor: 1, javaScriptEnabled: true },

        waitForNavigation: 'domcontentloaded',
        timeout: 9000,
        waitForAction: 100, // how long to wait after click, doubleClick or PressKey actions in ms.
        getPageTimeout: 7500,
        smartWait: 5000,
        waitForTimeout: 40000,
        fullPageScreenshots: false, // (on failure)

      },
    },
  }
);

module.exports = config;
