import { TAGS, RETRY_COUNT } from 'types';

Feature('Desktop').retry(RETRY_COUNT);

Scenario('check ', async ({ I, page, factory }) => {
  const signUpData = factory.auth.getUserSignUpData();

  await I.amOnPage(page.main.URL);
  await page.main.clickSignUpBtnInHeader();

  await page.resister.fillSignUpForm(signUpData.username, signUpData.email, signUpData.password);
  await page.resister.setAccountType();
  await page.resister.clickNextBtn();

  await I.see('Please confirm you have read our Terms & Conditions and Privacy Policy by ticking the box above.');
}).tag(TAGS.UI).tag(TAGS.DESKTOP);
