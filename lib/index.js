require('string-format-js');
var interfaces = {};

module.exports = {
  define: function(interfaceName, methodList) {
    interfaces[interfaceName] = methodList;
  },
  has: function(checkObject, interfaceName) {
    var objectKeys = Object.keys(checkObject);
    var errors = {};

    if(!interfaces[interfaceName]) {
      throw new Error('There is not interface define as %s'.format(interfaceName));
    }

    var checkList = interfaces[interfaceName];
    var checkDefinition;

    for(var x = 0; x < checkList.length; x += 1) {
      checkDefinition = checkList[x].split(':');

      //check that method exists
      if(!checkDefinition[1] || checkDefinition[1] !== 'p') {
        if(objectKeys.indexOf(checkDefinition[0]) === -1) {
          if(!errors.missingMethods) {
            errors.missingMethods = [];
          }

          errors.missingMethods.push(checkDefinition[0]);
          continue;
        } else if(typeof checkObject[checkDefinition[0]] !== 'function') {
          if(!errors.invalidType) {
            errors.invalidType = {};
          }

          errors.invalidType[checkDefinition[0]] = 'method';
          continue;
        }

        //check that parameter count matches if given
        if((checkDefinition[1] || checkDefinition[1] === '0') && checkDefinition[1] != checkObject[checkDefinition[0]].length) {
          if(!errors.parameterMismatch) {
            errors.parameterMismatch = [];
          }

          errors.parameterMismatch.push('%s should have %d parameters but it currently has %d parameters'.format(
          checkDefinition[0],
          checkDefinition[1],
          checkObject[checkDefinition[0]].length)
          );
          continue;
        }
      } else {
        if(objectKeys.indexOf(checkDefinition[0]) === -1) {
          if(!errors.missingProperties) {
            errors.missingProperties = [];
          }

          errors.missingProperties.push(checkDefinition[0]);
          continue;
        } else if(typeof checkObject[checkDefinition[0]] === 'function') {
          if(!errors.invalidType) {
            errors.invalidType = {};
          }

          errors.invalidType[checkDefinition[0]] = 'property';
          continue;
        }
      }

      checkDefinition = null;
    }

    return Object.keys(errors).length === 0 ? true : errors;
  }
};