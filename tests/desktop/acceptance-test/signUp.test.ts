import { TAGS } from 'types';

Feature('Desktop');

Scenario('check ', async ({ I, page }) => {
  await I.amOnPage(page.main.URL);
  await page.main.clickSignUpBtnInHeader();

  await page.resister.fillSignUpForm();
  await page.resister.setAccountType();
  await page.resister.clickNextBtn();

  await I.see('Please confirm you have read our Terms & Conditions and Privacy Policy by ticking the box above.');
}).tag(TAGS.UI).tag(TAGS.DESKTOP);
