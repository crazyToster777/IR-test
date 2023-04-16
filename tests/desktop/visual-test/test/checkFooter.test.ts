import { TAGS, VISUAL_DIFF_PARAMS } from 'types';

Feature('Desktop');

Scenario('Check footer (Error for example)', async ({ I, page }) => {
  await I.amOnPage(page.main.URL);
  await I.allowCookieBanner();

  await I.checkVisualDiffForElement(
    page.main.footer,
    'footer.png',
    VISUAL_DIFF_PARAMS
  );
}).tag(TAGS.DESKTOP).tag(TAGS.VISUAL);
