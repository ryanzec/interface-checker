var interfaceChecker = require('../lib/index');
var expect = require('chai').expect;

interfaceChecker.define('NoParameters', [
  'one'
]);
interfaceChecker.define('Parameters', [
  'one:2'
]);
interfaceChecker.define('MultipleMethods', [
  'one',
  'two:1',
  'three:4'
]);

describe('interface-checker', function() {
  it('validate method w/o parameter checking', function*() {
    expect(interfaceChecker.has({
      one: function() {

      }
    }, 'NoParameters')).to.be.true;
  });

  it('validate method w/ parameter checking', function*() {
    expect(interfaceChecker.has({
      one: function(one, two) {

      }
    }, 'Parameters')).to.be.true;
  });

  it('validate method w/ multiple methods', function*() {
    expect(interfaceChecker.has({
      one: function() {

      },
      two: function(one) {

      },
      three: function(one, two, three, four) {

      }
    }, 'MultipleMethods')).to.be.true;
  });

  it('should return false when method is not satisfied', function*() {
    expect(interfaceChecker.has({
      two: function(one, two) {

      }
    }, 'Parameters')).to.be.false;
  });

  it('should return false when method parameter count is not satisfied', function*() {
    expect(interfaceChecker.has({
      one: function(one) {

      }
    }, 'Parameters')).to.be.false;
  });

  it('should throw error when checking against interface that has not been defined', function*() {

  });
});