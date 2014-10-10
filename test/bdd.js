/**
 * In order to run the tests below, first ensure you did install `mocha` via NPM and run the following command:
 * 
 * ```bash
 * ./node_modules/.bin/mocha --check-leaks -u bdd ./test/bdd.js
 * ```
 */


var assert = require('assert');
var path = require('path');

var interfaceCheckerPath = path.resolve(__dirname, '../lib')
var interfaceChecker;


describe('Method interfacing', function () {
	beforeEach(function () {
		// Reinitialize the interface checker
		interfaceChecker = require(interfaceCheckerPath);
	});

	it('Validate a method without any parameter specification', function () {
		// Interface defintion
		var interfaceDefinition = {
			helloWorld: { type: 'function' }
		};
		interfaceChecker.define('helloWorld', interfaceDefinition);

		// Check
		var object = {
			name: 'Stouf',
			helloWorld: function () { console.log('Hello world !'); }
		};

		assert.doesNotThrow(function () {
			interfaceChecker.check(object, 'helloWorld');
		}, 'The interface is not respected');
	});

	it('Invalidate an object which does not have the expected method', function () {
		// Interface defintion
		var interfaceDefinition = {
			helloWorld: { type: 'function' }
		};
		interfaceChecker.define('helloWorld', interfaceDefinition);

		// Check
		var object = {
			name: 'Stouf',
		};

		var errorMessage;
		assert.throws(function () {
			interfaceChecker.check(object, 'helloWorld');
		}, function (error) {
			if (error.message !== 'doesNotRespectInterface') {
				errorMessage = 'Unexpected exception';
				return false;
			}
			if (error.errors.missingMethods.length !== 1) {
				errorMessage = 'Should have one missing method';
				return false;
			}
			if (error.errors.missingMethods[0] !== 'helloWorld') {
				errorMessage = 'Not the expected missing method';
				return false;
			}
			return true;
		}, errorMessage);
	});

	it('Validate a method with a number of parameters specified', function () {
		// Interface defintion
		var interfaceDefinition = {
			helloWorld: { type: 'function', numberOfParams: 2 }
		};
		interfaceChecker.define('helloWorld', interfaceDefinition);

		// Check
		var object = {
			name: 'Stouf',
			helloWorld: function (a, b) { console.log('Hello world !', a, b); }
		};
		assert.doesNotThrow(function () {
			interfaceChecker.check(object, 'helloWorld');
		}, 'The interface is not respected');
	});

	it('Invalidate a method with an incorrect number of parameters', function () {
		// Interface defintion
		var interfaceDefinition = {
			helloWorld: { type: 'function', numberOfParams: 2 }
		};
		interfaceChecker.define('helloWorld', interfaceDefinition);

		// Check
		var object = {
			name: 'Stouf',
			helloWorld: function () { console.log('Hello world !'); }
		};

		var errorMessage;
		assert.throws(function () {
			interfaceChecker.check(object, 'helloWorld');
		}, function (error) {
			if (error.message !== 'doesNotRespectInterface') {
				errorMessage = 'Unexpected exception';
				return false;
			}
			if (error.errors.parameterMismatch.length !== 1) {
				errorMessage = 'Should have one mismatch parameters method';
				return false;
			}
			if (error.errors.parameterMismatch[0].key !== 'helloWorld') {
				errorMessage = 'Not the expected mismatch';
				return false;
			}
			if (error.errors.parameterMismatch[0].expected !== 2) {
				errorMessage = 'invalid expected number of params';
				return false;
			}
			if (error.errors.parameterMismatch[0].actual !== 0) {
				errorMessage = 'invalid actual number of params';
				return false;
			}
			return true;
		}, errorMessage);
	});

	it('Invalidate a method which is actually a string', function () {
		// Interface defintion
		var interfaceDefinition = {
			helloWorld: { type: 'function', numberOfParams: 2 }
		};
		interfaceChecker.define('helloWorld', interfaceDefinition);

		// Check
		var object = {
			name: 'Stouf',
			helloWorld: 'Hello world !'
		};

		var errorMessage;
		assert.throws(function () {
			interfaceChecker.check(object, 'helloWorld');
		}, function (error) {
			if (error.message !== 'doesNotRespectInterface') {
				errorMessage = 'Unexpected exception';
				return false;
			}
			if (error.errors.invalidType.length !== 1) {
				errorMessage = 'Should have one invalid type';
				return false;
			}
			if (error.errors.invalidType[0].key !== 'helloWorld') {
				errorMessage = 'Not the expected invalid type';
				return false;
			}
			if (error.errors.invalidType[0].expected !== 'function') {
				errorMessage = 'invalid expected type';
				return false;
			}
			if (error.errors.invalidType[0].actual !== 'string') {
				errorMessage = 'invalid actual type';
				return false;
			}
			return true;
		}, errorMessage);
	});
});


describe('Property interfacing', function () {
	beforeEach(function () {
		// Reinitialize the interface checker
		interfaceChecker = require(interfaceCheckerPath);
	});

	it('Validate a object with the expected property', function () {
		// Interface defintion
		var interfaceDefinition = {
			name: { type: 'string' }
		};
		interfaceChecker.define('test', interfaceDefinition);

		// Check
		var object = {
			name: 'Stouf',
			helloWorld: function () { console.log('Hello world !'); }
		};

		assert.doesNotThrow(function () {
			interfaceChecker.check(object, 'test')
		}, 'The interface is not respected');
	});

	it('Invalidate an object which does not have the expected property', function () {
		// Interface defintion
		var interfaceDefinition = {
			name: { type: 'string' }
		};
		interfaceChecker.define('test', interfaceDefinition);

		// Check
		var object = {
			helloWorld: function () { console.log('Hello world !'); }
		};

		var errorMessage;
		assert.throws(function () {
			interfaceChecker.check(object, 'test');
		}, function (error) {
			if (error.message !== 'doesNotRespectInterface') {
				errorMessage = 'Unexpected exception';
				return false;
			}
			if (error.errors.missingProperties.length !== 1) {
				errorMessage = 'Should have one missing property';
				return false;
			}
			if (error.errors.missingProperties[0] !== 'name') {
				errorMessage = 'Not the expected missing property';
				return false;
			}
			return true;
		}, errorMessage);
	});

	it('Invalidate a property of type `string` which is actually a `boolean`', function () {
		// Interface defintion
		var interfaceDefinition = {
			name: { type: 'string' }
		};
		interfaceChecker.define('test', interfaceDefinition);

		// Check
		var object = {
			name: true
		};

		var errorMessage;
		assert.throws(function () {
			interfaceChecker.check(object, 'test');
		}, function (error) {
			if (error.message !== 'doesNotRespectInterface') {
				errorMessage = 'Unexpected exception';
				return false;
			}
			if (error.errors.invalidType.length !== 1) {
				errorMessage = 'Should have one invalid type';
				return false;
			}
			if (error.errors.invalidType[0].key !== 'name') {
				errorMessage = 'Not the expected invalid type';
				return false;
			}
			if (error.errors.invalidType[0].expected !== 'string') {
				errorMessage = 'invalid expected type';
				return false;
			}
			if (error.errors.invalidType[0].actual !== 'boolean') {
				errorMessage = 'invalid actual type';
				return false;
			}
			return true;
		}, errorMessage);
	});
});
