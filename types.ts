export const TAGS = {
  UI: 'UI',
  API: 'API',
  VISUAL: 'visual',
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
};

export const VISUAL_DIFF_PARAMS = {
  allowableDiffPercent: 0.05, // allowed diff (percent)
  captureActual: true,
  captureExpected: process.env.CAPTURE_EXPECTED || false,
  updateOnFail: (process.env.UPDATE_ON_FAIL === 'true'),
  threshold: 0.15,
  fullPage: true,
};

export const PASSWORD = 'test12345';
