require('string-format-js');
var interfaces = {};

module.exports = {
  define: function(interfaceName, methodList) {
    interfaces[interfaceName] = methodList;
  },
  has: function(checkObject, interfaceName) {
    var errors = {};

    if(!interfaces[interfaceName]) {
      throw new Error('There is not interface define as %s'.format(interfaceName));
    }

    var methodList = interfaces[interfaceName];
    var methodDefinition;

    for(var x = 0; x < methodList.length; x += 1) {
      methodDefinition = methodList[x].split(':');

      //check that method exists
      if(typeof checkObject[methodDefinition[0]] != 'function') {
        if(!errors.missing) {
          errors.missing = [];
        }

        errors.missing.push(methodDefinition[0]);
        continue;
      }

      //check that parameter count matches if given
      if((methodDefinition[1] || methodDefinition[1] === '0') && methodDefinition[1] != checkObject[methodDefinition[0]].length) {
        if(!errors.parameterMismatch) {
          errors.parameterMismatch = [];
        }

        errors.parameterMismatch.push('%s should have %d parameters but it currently has %d parameters'.format(
          methodDefinition[0],
          methodDefinition[1],
          checkObject[methodDefinition[0]].length)
        );
        continue;
      }

      methodDefinition = null;
    }

    return Object.keys(errors).length === 0 ? true : errors;
  }
};