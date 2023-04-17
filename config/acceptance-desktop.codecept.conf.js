const { merge } = require('lodash');

const { templateConfig } = require('./template.codecept.conf');

const config = merge(
  templateConfig,
  {
    tests: './tests/desktop/acceptance-test/*.test.ts',
    helpers: {
      Playwright: {
        url: process.env.BASE_URL,
        browser: 'chromium', // chromium|webkit
        show: (process.env.SHOW === 'true'), // default is false
        trace: (process.env.TRACE === 'true'), // default is false
        locale: 'en-US',
        windowSize: '1920x1080',
        waitForNavigation: 'domcontentloaded',
        timeout: 5000,
        waitForAction: 100, // how long to wait after click, doubleClick or PressKey actions in ms.
        getPageTimeout: 9000,
        smartWait: 5000,
        waitForTimeout: 40000,
        fullPageScreenshots: false, // (on failure)
      },
    },
  }
);

module.exports = config;
