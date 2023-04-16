/* eslint-disable import/no-import-module-exports */
import mainPage from "./pages/main";


// @ts-ignore
module.exports = function () {
  return actor({

    async allowCookieBanner() {
      await this.waitForVisible(mainPage.cookieBanner.banner);
      await this.click(mainPage.cookieBanner.allowBtn);
    },
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
  });
};
