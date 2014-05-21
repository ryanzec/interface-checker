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

  it('should return error object when method is not satisfied', function*() {
    expect(interfaceChecker.has({
      two: function(one, two) {

      }
    }, 'Parameters')).to.deep.equal({
      missing: [
        'one'
      ]
    });
  });

  it('should return error object when method parameter count is not satisfied', function*() {
    expect(interfaceChecker.has({
      one: function(one) {

      }
    }, 'Parameters')).to.deep.equal({
      parameterMismatch: [
        'one should have 2 parameters but it currently has 1 parameters'
      ]
    });
  });

  it('should return error object when multiple issues are present', function*() {
    expect(interfaceChecker.has({
      one: function(one) {

      },
      three: function(one, two) {

      }
    }, 'MultipleMethods')).to.deep.equal({
      missing: [
        'two'
      ],
      parameterMismatch: [
        'three should have 4 parameters but it currently has 2 parameters'
      ]
    });
  });

  it('should throw error when checking against interface that has not been defined', function*() {

  });
});