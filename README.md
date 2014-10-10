# Interface Checker

A node library to store interface definitions and check to see if an object matches a defined interface.
Can match method names and optionally parameter count.


## How to install ?


### NPM

```bash
npm install interface-checker
```

### Install with [component(1)](http://component.io):

```bash
$ component install ryanzec/interface-checker
```

# Quick Start

## Define your interface

Here is how to define an interface

```javascript
var interface = {
	myKeyName: { type: 'string' },
	myOtherKeyName: { type: 'function' },
	yetAnotherKeyName: { type: 'function', numberOfParams: 2 },
};
```

* The `numberOfParams` property is optional for the methods.
* The standard JavaScript types are used, which are: (please respect the case)
  * `object`
  * `string`
  * `boolean`
  * `number`
  * `undefined`

Once the object built, just give it to the interface checker as follow:

```javascript
var interfaceChecker = require('interface-checker');
interfaceChecker.define('myInterfaceName', interface);
```


## Validate objects

Once you have defined one (or more) interface, you can check if some objects are valid regarding interfaces you have
defined. For example, with the previous interface:

```javascript
var object = {
	myKeyName: 'Hello',
	myOtherKeyName: function () { console.log('Hello world !'); },
	yetAnotherKeyName: function (a, b) { console.log(a, b); }
};

try {
	interfaceChecker.check(object, 'myInterfaceName');
} catch (expt) {
	console.log(expt.message); // `doesNotRespectInterface`
	console.log(JSON.stringify(expt.errors, null, 2)); // JSON describing the errors
}
```

Below are the properties `expt.errors` will have if an expection gets thrown:
* `missingMethods`: Array of the missing methods
* `missingProperties`: Array of the missing properties
* `invalidType`: Array of objects such as
  ```javascript
  {
    key: 'theKeyName'
    expected: 'expectedType',
    actual: 'actualType'
  }
  ```
* `parameterMismatch`: Array of objects such as
  ```javascript
  {
  	key: 'theKeyName',
  	expected: 'expectedNumOfParams',
  	actual: 'actualNumOfParams'
  }
  ```



## LICENSE

MIT
)
