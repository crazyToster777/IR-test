import { VISUAL_DIFF_PARAMS, TAGS } from 'types';

Feature('Desktop');

Scenario('Check features list', async ({ I }) => {
  await I.amOnPage('/features');

  await I.checkVisualDiff(
    'feature_list.png',
    VISUAL_DIFF_PARAMS
  );
}).tag(TAGS.DESKTOP).tag(TAGS.VISUAL);
