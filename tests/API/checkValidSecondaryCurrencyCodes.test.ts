import { RETRY_COUNT, TAGS } from 'types';

Feature('API').retry(RETRY_COUNT);

Scenario('Check valid secondary currency codes', async ({ I }) => {
  I.sendGetRequest('/Public/GetValidSecondaryCurrencyCodes');
  I.seeResponseCodeIsSuccessful();
  I.seeResponseEquals([
    'Aud',
    'Usd',
    'Nzd',
    'Sgd',
  ]);
}).tag(TAGS.API);
