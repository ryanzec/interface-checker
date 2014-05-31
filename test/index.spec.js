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
interfaceChecker.define('WithProperty', [
  'one:p',
  'two',
  'three:4'
]);

describe('interface-checker', function() {
  describe('methods', function() {
    it('should validate w/o parameter checking', function*() {
      expect(interfaceChecker.has({
        one: function() {

        }
      }, 'NoParameters')).to.be.true;
    });

    it('should validate w/ parameter checking', function*() {
      expect(interfaceChecker.has({
        one: function(one, two) {

        }
      }, 'Parameters')).to.be.true;
    });

    it('should validate w/ multiple methods', function*() {
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
        missingMethods: [
          'one'
        ]
      });
    });

    it('should return error object when parameter count is not satisfied', function*() {
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
        missingMethods: [
          'two'
        ],
        parameterMismatch: [
          'three should have 4 parameters but it currently has 2 parameters'
        ]
      });
    });

    it('should throw error when checking against interface that has not been defined', function*() {
      var err = "There is not interface define as UndefinedInterface";

      expect(function() {
        interfaceChecker.has({}, 'UndefinedInterface');
      }).to.throw(err);
    });

    it('should return error object when property is given', function*() {
      expect(interfaceChecker.has({
        one: 'test',
        two: function(one) {

        },
        three: function(one, two, three, four) {

        }
      }, 'MultipleMethods')).to.deep.equal({
        invalidType: {
          one: 'method'
        }
      });
    });
  });

  describe('properties', function() {
    it('should validate property checking', function*() {
      expect(interfaceChecker.has({
        one: 'test',
        two: function() {

        },
        three: function(one, two, three, four) {

        }
      }, 'WithProperty')).to.be.true;
    });

    it('should return error object w/ missing property', function*() {
      expect(interfaceChecker.has({
        two: function() {

        },
        three: function(one, two, three, four) {

        }
      }, 'WithProperty')).to.deep.equal({
        missingProperties: [
          'one'
        ]
      });
    });

    it('should return error object when method is given', function*() {
      expect(interfaceChecker.has({
        one: function() {

        },
        two: function(one) {

        },
        three: function(one, two, three, four) {

        }
      }, 'WithProperty')).to.deep.equal({
        invalidType: {
          one: 'property'
        }
      });
    });
  });
});