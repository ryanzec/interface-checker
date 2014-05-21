require('string-format-js');
var interfaces = {};

module.exports = {
  define: function(interfaceName, methodList) {
    interfaces[interfaceName] = methodList;
  },
  has: function(checkObject, interfaceName) {
    if(!interfaces[interfaceName]) {
      throw new Error('There is not interface define as %s'.format(interfaceName));
    }

    var methodList = interfaces[interfaceName];
    var methodDefinition;

    for(var x = 0; x < methodList.length; x += 1) {
      methodDefinition = methodList[x].split(':');

      //check that method exists
      if(typeof checkObject[methodDefinition[0]] != 'function') {
        return false;
      }

      //check that parameter count matches if given
      if((methodDefinition[1] || methodDefinition[1] === '0') && methodDefinition[1] != checkObject[methodDefinition[0]].length) {
        return false;
      }

      methodDefinition = null;
    }

    return true;
  }
};