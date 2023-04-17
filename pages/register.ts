const { I } = inject();

const mainPage = {
  URL: '/register',
  _signUpForm: {
    usernameField: '[id=login]',
    emailField: '[id=email]',
    passwordField: '[id=password]',
    nextSignUpBtn: 'button[class*=--primary]',
  },

  async fillSignUpForm(username: string, email: string, password: string) {
    await I.fillField(this._signUpForm.usernameField, username);
    await I.fillField(this._signUpForm.emailField, email);
    await I.fillField(this._signUpForm.passwordField, password);
  },

  async clickNextBtn() {
    await I.waitForVisible(this._signUpForm.nextSignUpBtn);
    await I.click(this._signUpForm.nextSignUpBtn);
  },

  async setAccountType() {
    await I.checkOption('#headlessui-radiogroup-option-3');
  },

};

export = mainPage;
