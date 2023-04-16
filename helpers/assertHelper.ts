import Helper from '@codeceptjs/helper';

const chai = require('chai');

const { expect } = chai;

class AssertHelper extends Helper {
  /**
   * https://www.chaijs.com/api/bdd/#method_equal
   */
  assertEqual(actualValue, expectedValue, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).to.equal(expectedValue);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_not
   * https://www.chaijs.com/api/bdd/#method_equal
   */
  assertNotEqual(actualValue, expectedValue, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).not.to.equal(expectedValue);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_deep
   * https://www.chaijs.com/api/bdd/#method_equal
   */
  assertDeepEqual(actualValue, expectedValue, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).to.deep.equal(expectedValue);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_not
   * https://www.chaijs.com/api/bdd/#method_deep
   * https://www.chaijs.com/api/bdd/#method_equal
   */
  assertNotDeepEqual(actualValue, expectedValue, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).to.not.deep.equal(expectedValue);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_include
   */
  assertContain(actualValue, expectedValueToContain, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).to.contain(expectedValueToContain);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_not
   * https://www.chaijs.com/api/bdd/#method_include
   */
  assertNotContain(actualValue, expectedValueToNotContain, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).not.to.contain(expectedValueToNotContain);
  }

  /**
   * https://www.npmjs.com/package/chai-string#startswithstartwith
   */
  assertStartsWith(actualValue, expectedValueToStartWith, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).to.startsWith(expectedValueToStartWith);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_not
   * https://www.npmjs.com/package/chai-string#startswithstartwith
   */
  assertNotStartsWith(actualValue, expectedValueToNotStartWith, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).not.to.startsWith(expectedValueToNotStartWith);
  }

  /**
   * https://www.npmjs.com/package/chai-string#endswithendwith
   */
  assertEndsWith(actualValue, expectedValueToEndWith, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).to.endsWith(expectedValueToEndWith);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_not
   * https://www.npmjs.com/package/chai-string#endswithendwith
   */
  assertNotEndsWith(actualValue, expectedValueToNotEndWith, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).not.to.endsWith(expectedValueToNotEndWith);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_property
   */
  assertHasProperty(targetData, propertyName, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.have.property(propertyName);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_a
   */
  assertHasAProperty(targetData, propertyName, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.have.a.property(propertyName);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_a
   */
  assertToBeA(targetData, type, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.be.a(type);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_a
   */
  assertToBeAn(targetData, type, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.be.an(type);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_match
   */
  assertMatchRegex(targetData, regex, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.match(regex);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_lengthof
   */
  assertLengthOf(targetData, length, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.have.lengthOf(length);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_empty
   */
  assertEmpty(targetData, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.be.empty;
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_true
   */
  assertTrue(targetData, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.be.true;
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_false
   */
  assertFalse(targetData, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.be.false;
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_above
   */
  assertAbove(targetData, aboveThan, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.be.above(aboveThan);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_below
   */
  assertBelow(targetData, belowThan, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.be.below(belowThan);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_lengthof
   * https://www.chaijs.com/api/bdd/#method_above
   */
  assertLengthAboveThan(targetData, lengthAboveThan, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.have.lengthOf.above(lengthAboveThan);
  }

  /**
   * https://www.chaijs.com/api/bdd/#method_lengthof
   * https://www.chaijs.com/api/bdd/#method_below
   */
  assertLengthBelowThan(targetData, lengthBelowThan, customErrorMsg = '') {
    return expect(targetData, customErrorMsg).to.have.lengthOf.below(lengthBelowThan);
  }

  /**
   * https://www.npmjs.com/package/chai-string#equalignorecase
   */
  assertEqualIgnoreCase(actualValue, expectedValue, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).to.equalIgnoreCase(expectedValue);
  }

  /**
   * Asserts members of two arrays are deeply equal
   * https://www.chaijs.com/api/bdd/#method_deep
   */
  assertDeepMembers(actualValue, expectedValue, customErrorMsg = '') {
    return expect(actualValue, customErrorMsg).to.have.deep.members(expectedValue);
  }
}

export = AssertHelper;
