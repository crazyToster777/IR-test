const { I } = inject();

const mainPage = {
  URL: '/',
  cookieBanner: {
    banner: '[id=adroll_consent_banner]',
    allowBtn: '[id=adroll_consent_accept]',
  },
  headerSignUpBtn: '[class=unauthorized-user-links] [class*=unauthorized-user-links__signup]',
  mobileDrawer: 'button[class*=mobile-menu-button]',
  mobileSignUpBtnInMenu: '[class*=unauthorized-user-links_variant_mobile] [class*=unauthorized-user-links__signup]',
  mobileAppBtn: '[class*=header__app-button]',
  footer: '[class=footer__container]',

  async clickSignUpBtnInHeader() {
    await I.waitForVisible(this.headerSignUpBtn);
    await I.click(this.headerSignUpBtn);
    await I.switchToNextTab();
    await I.seeInCurrentUrl('register');
  },

  async openDrawerOnMobile() {
    await I.waitForVisible(this.mobileDrawer);
    await I.click(this.mobileDrawer);
  },

  async clickSignUpBtnOnMobile() {
    await I.waitForVisible(this.mobileSignUpBtnInMenu);
    await I.click(this.mobileSignUpBtnInMenu);
    await I.switchToNextTab();
  },

};
export = mainPage;
