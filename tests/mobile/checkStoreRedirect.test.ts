import { TAGS } from 'types';

Feature('Mobile');

Scenario('Check redirect to app for mobile device ', async ({ I, page }) => {
  await I.amOnPage(page.main.URL);
  await I.allowCookieBanner();
  await page.main.openDrawerOnMobile();
  await page.main.clickSignUpBtnOnMobile();
  // @ts-ignore
  const URL = await I.executeScript(() => window.web_store_link);
  I.assertEqual(URL, 'https://apps.apple.com/AU/app/id1566499416?mt=8');
}).tag(TAGS.MOBILE).tag(TAGS.UI);
