/// <reference types='codeceptjs' />
type stepsFile = typeof import('./stepsFile');
type page = typeof import('./pages/all')
type assertHelper = import('./helpers/assertHelper');


/* eslint-disable no-unused-vars */
declare namespace CodeceptJS {

  interface Methods extends  visualHelper, assertHelper, PlaywrightTs {}

  interface I extends ReturnType<stepsFile>,
    WithTranslation<visualHelper>, WithTranslation<Methods>, WithTranslation<assertHelper> {}

  namespace Translation {
    interface Actions {}
  }

  interface SupportObject {
    I: I,
    current: any,
    page: page,
  }
}
/* eslint-enable no-unused-vars */
