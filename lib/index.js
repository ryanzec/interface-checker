var interfaces = {};


/**
 * @desc Define and record an interface.
 *
 * @param  {String}   name       - The name for the interface.
 * @param  {Object[]} definition - The actual definition.
 */
function define(name, definition) {
  interfaces[name] = definition;
}


/**
 * @desc Check if an object respects a given interface definition.
 *
 * @param  {Object}  checkObject   - The object to test.
 * @param  {String}  interfaceName - The name of the interface to take as a reference.
 *
 * @throws {Error} `doesNotRespectInterface`
 *                 If the object does not respect the interface definition, an expection is thrown.
*                    `Error.message` is an object with the following properties:
*                    * `missingMethods` (Array)
*                    * `missingProperties` (Array)
*                    * `invalidType` (Array)
*                    * `parameterMismatch` (Array)
 */
function check(checkObject, interfaceName) {
  var checkList = interfaces[interfaceName];

  // Does `interfaceName` exist ?
  if (!checkList) {
    throw new Error('There is not interface define as {0}'.format(interfaceName));
  }

  // The object that is gonna be returned in case of errors
  var errors = {
    missingMethods: [],
    missingProperties: [],
    invalidType: [],
    parameterMismatch: []
  };

  for (var keyName in checkList) {
    var checkItem = checkList[keyName];

    var expectedType = checkItem.type;
    var isMethod = (expectedType === 'function');

    var objectProperty = checkObject[keyName];
    var objectPropertyType = typeof(objectProperty);

    // Check if there are missing properties or methods
    if (objectProperty === undefined) {
      var targetedError = isMethod ? errors.missingMethods : errors.missingProperties;
      targetedError.push(keyName);
      continue;
    }

    // Check for invalid types
    if(objectPropertyType !== expectedType) {
      errors.invalidType.push({
        key: keyName,
        expected: expectedType,
        actual: objectPropertyType
      });
      continue;
    }

    // If a method and if specified, count the number of parameters
    var numberOfParams = checkItem.numberOfParams;
    var actualNumberOfParams = objectProperty.length;
    if ((numberOfParams !== undefined) && isMethod && (numberOfParams !== actualNumberOfParams)) {
      errors.parameterMismatch.push({
        key: keyName,
        expected: numberOfParams,
        actual: actualNumberOfParams
      });
      continue;
    }
  }

  // Is there an error ?
  var hasError =
    errors.missingMethods.length > 0 ||
    errors.missingProperties.length > 0 ||
    errors.invalidType.length > 0 ||
    errors.parameterMismatch.length > 0;

  // return hasError ? errors : true;
  if (hasError) {
    var exception = new Error('doesNotRespectInterface');
    exception.errors = errors;
    throw exception;
  }
}




//////////////////////
// Exposed function //
//////////////////////

exports.define = define;
exports.check = check;
