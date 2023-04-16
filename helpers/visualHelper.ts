import Helper from '@codeceptjs/helper';

const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const SUFFIX = '';

type LibraryParams = {
  // Color difference threshold (from 0 to 1). Less - more precise.
  threshold: number,

  // color of different pixels in diff output (e.g. [255, 0, 0])
  diffColor: number[],

  // whether to detect dark on light differences between images
  // and set an alternative color to differentiate between the two (e.g. [60, 0, 255])
  diffColorAlt: number[],

  // draw the diff over a transparent background (a mask)
  diffMask: boolean,

  // whether to skip anti-aliasing detection
  includeAA: boolean,
}

type HelperParams = {

  captureActual?: boolean | 'missing' | string,
  captureExpected?: boolean | 'missing' | string,

  // Amount of diff (in percent) which is not a problem
  allowableDiffPercent?: number;

  // TODO: implement
  // allowableDiffPixels?: number;

  // color sensitive (where 0 -- precise, 1 -- colorblind)
  threshold?: number

  // Overwrites expected image with actual if diff more than allowableDiffPercent
  updateOnFail?: boolean;

  // Flag to enable fullscreen screenshot mode (optional, false by default)
  fullPage?: boolean
}

/** Backup of initial state */
const INITIAL = {
  settings: {},

  args: {
    threshold: 0.10,
    diffColor: [0xCD, 0x2C, 0xC9], // '#cd2cc9'
    diffColorAlt: [0x2C, 0xCD, 0x39], // '#2ccd39'
    diffMask: false,
    includeAA: false,
  },

  result: {
    match: false, reason: '', diffCount: 0, diffPercentage: 0,
  },
};

// @ts-ignore
class VisualHelper extends Helper {
  /** Relative path to the folder that contains relevant images. */
  globalDir = {
    expected: '',
    actual: '',
    diff: '',
  };

  globalDiffPrefix = 'DIFF_';

  /**  Name of the image to compare. */
  imageName: string = '';

  /** Contains the image paths for the current test. */
  imgPath = {
    expected: '',
    actual: '',
    diff: '',
  };

  /** Holds comparison results. */
  result = {
    match: true,
    reason: '',
    diffCount: 0,
    diffPercentage: 0,
  };

  settings: HelperParams = {
    captureActual: true,
    captureExpected: false,
    allowableDiffPercent: 0.01,
    fullPage: undefined,
  };

  args: LibraryParams = { ...INITIAL.args };

  /**
   * Constructor that initializes the helper.
   * Called internally by CodeceptJS.
   */
  constructor(config) {
    super(config);

    if (!config.dirActual) {
      throw new Error('You should set `VisualHelper.dirActual` in helper config');
    }

    if (!config.dirExpected) {
      throw new Error('You should set `VisualHelper.dirExpected` in helper config');
    }

    if (!config.dirDiff) {
      throw new Error('You should set `VisualHelper.dirDiff` in helper config');
    }

    this.globalDir.actual = this._resolvePath(config.dirActual);
    this.globalDir.expected = this._resolvePath(config.dirExpected);
    this.globalDir.diff = this._resolvePath(config.dirDiff);

    if (typeof config.captureActual !== 'undefined') {
      this.settings.captureActual = this._toBool(config.captureActual, ['missing']);
    }

    if (typeof config.captureExpected !== 'undefined') {
      this.settings.captureExpected = this._toBool(config.captureExpected, ['missing']);
    }

    if (typeof config.allowableDiffPercent !== 'undefined') {
      this.settings.allowableDiffPercent = Math.min(100, Math.max(0, parseFloat(config.allowableDiffPercent)));
    }

    INITIAL.settings = { ...this.settings };

    if (typeof config.threshold !== 'undefined') {
      this.args.threshold = Math.min(1, Math.max(0, parseFloat(config.threshold)));
    }

    INITIAL.args = { ...this.args };
  }

  /**
   * Same as checkVisualDiff but make screenshot of element (instead of whole page)
   *
   * await I.checkVisualDiffForElement('h1', 'header.png');
   * await I.checkVisualDiffForElement('[class*=spyAvatar]', 'bond_james_bond', { allowableDiffPercent: 0.05 });
   */
  async checkVisualDiffForElement(element: CodeceptJS.LocatorOrString, image: string, options?: HelperParams) {
    await this.takeScreenshot(image, 'actual', element);

    const capture = options?.captureExpected;
    const expectedImg = this._buildPath('expected');

    if (capture === true || (capture === 'missing' && !this._isFile(expectedImg))) {
      await this.takeScreenshot(image, 'expected', element);
    }

    if (!this._isFile(expectedImg)) {
      throw new Error(`Expected image not found at path ${expectedImg}`);
    }

    await this.checkVisualDiff(image, { ...options, captureExpected: false, captureActual: false });
  }

  /**
   * Compares the given screenshot with the expected image. When too many
   * differences are detected, the test will fail.
   *
   * await I.checkVisualDiff('dashboard');
   * await I.checkVisualDiff('dashboard.png', { captureActual: false, allowableDiffPercent: 5 });
   */
  async checkVisualDiff(image: string, options?: HelperParams) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        await this._getVisualDifferences(image, options);
      } catch (err) {
        this.debug(`ERROR from diff tool\n\t ${err.message}`);
        reject(err);
      }

      const res = this.result;

      if (res.match) {
        this.debug(`Difference: ${res.diffPercentage}% 👍`);
        resolve(res);
      } else {
        this.debug(`Difference: ${res.diffPercentage}% 👎 ${this.imgPath.diff}`);
        const message = res.reason || `Images are different by ${res.diffPercentage}% - see the report attachments`;
        reject(message);
      }
    });
  }

  async _getVisualDifferences(image, options?: HelperParams) {
    await this._setupTest(image, options);

    this.debug(`Check differences in ${image} ...`);

    await this._maybeCaptureImage('expected', this.settings.captureExpected, options?.fullPage);
    await this._maybeCaptureImage('actual', this.settings.captureActual, options?.fullPage);

    if (!this._isFile(this.imgPath.expected)) throw new Error(`Can't read file ${this.imgPath.expected}`);

    if (!this._isFile(this.imgPath.actual)) throw new Error(`Can't read file ${this.imgPath.actual}`);

    const localResult = {
      match: false, reason: '', diffCount: -1, diffPercentage: -1,
    };

    const imgExpect = PNG.sync.read(fs.readFileSync(this.imgPath.expected));
    const imgActual = PNG.sync.read(fs.readFileSync(this.imgPath.actual));
    const { width, height } = imgExpect;
    const diff = new PNG({ width, height });

    if (imgActual.width !== width || imgActual.height !== height) {
      localResult.match = false;
      localResult.reason = 'Image sizes do not match';
    } else {
      const totalPixels = width * height;

      const diffPixels = pixelmatch(
        imgExpect.data,
        imgActual.data,
        diff.data,
        width,
        height,
        this.args
      );
      const diffPercent = 100 * diffPixels / totalPixels;

      localResult.diffCount = diffPixels;
      localResult.diffPercentage = diffPercent;
      localResult.match = (diffPercent < (this.settings.allowableDiffPercent as number));
    }

    if (!localResult.match) {
      // this.debug(`result = ${JSON.stringify(localResult)}`);

      const allure = codeceptjs.container.plugins('allure');

      allure.addAttachment('Actual ', fs.readFileSync(this.imgPath.actual, { flag: 'r' }), 'image/png');
      allure.addAttachment('Expected ', fs.readFileSync(this.imgPath.expected, { flag: 'r' }), 'image/png');

      if (localResult.diffCount > 0) {
        fs.writeFileSync(this.imgPath.diff, PNG.sync.write(diff));
        allure.addAttachment('Diff ', fs.readFileSync(this.imgPath.diff), 'image/png');
      }

      if (this.settings.updateOnFail) {
        fs.copyFile(this.imgPath.actual, this.imgPath.expected, (err) => { if (err) throw err; });
        this.debug(`‼️ Baseline ${this.imgPath.expected} was updated because of 'updateOnFail' option`);
      }
    }

    Object.assign(this.result, localResult);
    return localResult;
  }

  /**
   * Examples:
   *   await I.takeScreenshot('whole_page', 'expected')
   *   await I.takeScreenshot('whole_page.png', 'actual')
   *   await I.takeScreenshot('tutor_card', 'actual', locate('[class*=CardPosterIntro])')
   */
  async takeScreenshot(name: string, which: 'actual'|'expected', element?: CodeceptJS.LocatorOrString) {
    await this._setupTest(name, undefined);

    if (this.helpers.LxpHelper) await this.helpers.LxpHelper.waitForNetworkIdle();

    if (element) {
      await this._takeElementScreenshot(name, which, element);
    } else {
      await this._takeScreenshot(name, which);
    }
  }

  async _takeElementScreenshot(name: string, which: 'actual'|'expected', element: CodeceptJS.LocatorOrString) {
    const driver = this._getDriver();

    // The output path where the screenshot is saved to.
    const outputFile = this._buildPath(which, SUFFIX);

    // Screenshot a single element.
    await driver.waitForVisible(element);
    if (this.helpers.LxpHelper) await this.helpers.LxpHelper.waitForNetworkIdle();
    await driver.saveElementScreenshot(element, outputFile);
  }

  async _takeScreenshot(name: string, which: 'actual'|'expected', fullPage?: boolean) {
    const driver = this._getDriver();

    // The output path where the screenshot is saved to.
    const outputFile = this._buildPath(which, SUFFIX);

    // Temporary path for avoid multithreading problems
    const tempFile = this._buildPath(which, Math.random().toString(36).slice(-5));
    // console.log('tempFile = ', tempFile);

    if (this.helpers.LxpHelper) await this.helpers.LxpHelper.waitForNetworkIdle();
    // Screenshot the current viewport into a temp file.
    await driver.saveScreenshot(tempFile, fullPage);
    this._deleteFile(outputFile);

    fs.renameSync(tempFile, outputFile);
    this._deleteFile(tempFile);
  }

  async _maybeCaptureImage(which: 'expected' | 'actual', captureFlag?: boolean | string, fullPage?: boolean) {
    if (captureFlag === false) { return; }

    if (captureFlag === 'missing') {
      const _path = this._buildPath(which, SUFFIX);

      if (this._isFile(_path, 'read')) {
        // Not missing: Exact image match.
        return;
      }
    }

    await this._takeScreenshot(this.imageName, which, fullPage);
  }

  async _setupTest(image: string, options?: HelperParams) {
    // Set the name of the current image.
    this.imageName = image.replace(/(~.+)?\.png$/, '');

    // Prepare paths for the current operation.
    this.imgPath.expected = this._buildPath('expected', SUFFIX);
    this.imgPath.actual = this._buildPath('actual', SUFFIX);
    this.imgPath.diff = this._buildPath('diff', SUFFIX);

    // Reset values to initial
    this.result = { ...INITIAL.result };
    this.settings = { ...INITIAL.settings };
    this.args = { ...INITIAL.args };

    if (options) {
      if (options.updateOnFail) {
        if (process.env.CI === 'true') throw new Error('⛔️ NEVER use `updateOnFail` option on CI');
        this.settings.updateOnFail = options.updateOnFail;
      }

      if (typeof options.captureActual !== 'undefined') {
        this.settings.captureActual = this._toBool(options.captureActual, ['missing']);
      }

      if (typeof options.captureExpected !== 'undefined') {
        this.settings.captureExpected = this._toBool(options.captureExpected, ['missing']);
      }

      if (typeof options.allowableDiffPercent !== 'undefined') {
        this.settings.allowableDiffPercent = Math.min(100, Math.max(0, options.allowableDiffPercent));
      }

      if (typeof options.fullPage !== 'undefined') {
        this.settings.fullPage = this._toBool(options.fullPage, []) as boolean;
      }

      if (typeof options.threshold !== 'undefined') {
        this.args.threshold = Math.min(1, Math.max(0, options.threshold));
      }
    }
  }

  _getDriver() {
    let driver;

    if (this.helpers.Puppeteer) {
      driver = this.helpers.Puppeteer;
      driver._which = 'Puppeteer';
    } else if (this.helpers.WebDriver) {
      driver = this.helpers.WebDriver;
      driver._which = 'WebDriver';
    } else if (this.helpers.Appium) {
      driver = this.helpers.Appium;
      driver._which = 'Appium';
    } else if (this.helpers.WebDriverIO) {
      driver = this.helpers.WebDriverIO;
      driver._which = 'WebDriverIO';
    } else if (this.helpers.Playwright) {
      driver = this.helpers.Playwright;
      driver._which = 'Playwright';
    } else {
      throw new Error('Unsupported driver. Helper supports [Playwright|WebDriver|Appium|Puppeteer]');
    }

    return driver;
  }

  /** Recursively creates the specified directory. */
  _mkdirp(dir) {
    fs.mkdirSync(dir, { recursive: true });
  }

  /** Deletes the specified file, if it exists. */
  _deleteFile(file) {
    try {
      if (this._isFile(file, 'write')) {
        fs.unlinkSync(file);
      }
    } catch (err) {
      throw new Error(`Could not delete target file "${file}" - is it read-only?`);
    }
  }

  /** Tests, if the given file exists and accessible */
  _isFile(file, mode: 'read' | 'write' = 'read') {
    let accessFlag: number = fs.constants.F_OK;

    if (mode === 'read') {
      // eslint-disable-next-line no-bitwise
      accessFlag |= fs.constants.R_OK;
    } else if (mode === 'write') {
      // eslint-disable-next-line no-bitwise
      accessFlag |= fs.constants.W_OK;
    }

    try {
      // If access permission fails, an error is thrown.
      fs.accessSync(file, accessFlag);
      return true;
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`${err.code}:  ${file}`);
      }

      return false;
    }
  }

  /** Builds the absolute path to a relative folder. */
  _resolvePath(dir) {
    if (!path.isAbsolute(dir)) {
      // @ts-ignore
      return `${path.resolve(global.codecept_dir, dir)}/`;
    }

    return dir;
  }

  /**  Returns the filename of an image. */
  _getFileName(which: 'expected' | 'actual' | 'diff', suffix?: string) {
    let filename = this.imageName;

    if (filename.substr(-4) !== '.png') filename += '.png';

    if (which === 'diff') {
      const parts = filename.split(/[/\\]/);
      parts[parts.length - 1] = this.globalDiffPrefix + parts[parts.length - 1];
      filename = parts.join(path.sep);
      // example: `specialSubBir/myScreenshot.png` → `specialSubBir/DIFF_myScreenshot.png`
    }

    if (suffix) {
      filename = `${filename.substr(0, filename.length - 4) + suffix}.png`;
    }

    return filename;
  }

  /** Builds an image path using the current image name and the specified folder. */
  _buildPath(which: 'expected' | 'actual' | 'diff', suffix?: string) {
    let fullPath;
    const dir = this.globalDir[which];

    if (!dir) {
      if (path.isAbsolute(which) && this._isFile(which, 'read')) {
        fullPath = which;
      } else {
        throw new Error(`No ${which}-folder defined.`);
      }
    } else {
      fullPath = dir + this._getFileName(which, suffix);
      this._mkdirp(path.dirname(fullPath));
    }

    return fullPath;
  }

  /**
   * Casts the given value into a boolean. Several string terms are translated
   * to boolean true. If validTerms are specified, and the given value matches
   * one of those validTerms, the term is returned instead of a boolean.
   *
   * Sample:
   *
   * _toBool('yes')                 --> true
   * _toBool('n')                   --> false
   * _toBool('missed')              --> false
   * _toBool('missed', ['missed'])  --> 'missed'
   *
   * @param {any} value - The value to cast.
   * @param {array} validTerms - List of terms that should not be cast to a
   *         boolean but returned directly.
   * @return {bool|string} Either a boolean or a lowercase string.
   * @private
   */
  _toBool(value: boolean | string, validTerms : any[] = []) {
    if (validTerms.includes(value)) {
      return value;
    }

    value = [true, 1, 'true', 'y', 'yes', 'on'].includes(value);

    return value;
  }
}

export = VisualHelper;
