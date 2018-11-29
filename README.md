twin-bcrypt
===========
[![Build Status](https://secure.travis-ci.org/fpirsch/twin-bcrypt.png)](http://travis-ci.org/fpirsch/twin-bcrypt.png)
[![Dependency Status](https://david-dm.org/fpirsch/twin-bcrypt.png)](https://david-dm.org/fpirsch/twin-bcrypt)

Fast [asm.js](https://en.wikipedia.org/wiki/Asm.js) implementation of the [BCrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm for Node and the browser without dependencies.
See the [demo here](http://fpirsch.github.io/twin-bcrypt/).
Also used in the real world in this great [.htpasswd file generator](http://aspirine.org/htpasswd_en.html) in parallel with
[web workers](https://en.wikipedia.org/wiki/Web_worker).


## Basic usage:
#### Node.js
```javascript
var TwinBcrypt = require('twin-bcrypt');
```

#### Browser
```html
<script src="twin-bcrypt.min.js"></script>
```
or
```html
<script src="setImmediate.js"></script>
<script src="twin-bcrypt.js"></script>
```
`setImmediate` [is a native Node.js function](https://nodejs.org/api/timers.html) that is implemented in IE10+ but not in Chrome and Firefox browsers.
`twin-bcrypt.min.js` includes a polyfill for it, but the non-minified version will need an explicit link to the polyfill
(included in the `node_modules` folder) to run properly in browser environments.



#### Synchronous (blocking)
```javascript
var hash = TwinBcrypt.hashSync("bacon");
TwinBcrypt.compareSync("bacon", hash); // true
TwinBcrypt.compareSync("veggies", hash); // false
```

#### Asynchronous (non-blocking)
Asynchronous mode is preferred. Besides not blocking the javascript engine, it gives the opportunity to display progression information, and even to abort computations.

With a default-generated salt.
```javascript
TwinBcrypt.hash("bacon", function(hash) {
  // Store hash in your password DB.
});
```

With progression info and optional operation abort.
```javascript
TwinBcrypt.hash("bacon",
  function(p) {
    progressBar.value = p;
    if (tooLong) return false;
  },
  function(hash) {
    // Store hash in your password DB.
  }
);
```

Check a given password against a given hash
```javascript
// Load hash from your password DB.
TwinBcrypt.compare("bacon", hash, function(result) {
    // result === true
});
TwinBcrypt.compare("veggies", hash, function(result) {
    // result === false
});
```

In the above examples, the salt is automatically generated and attached to the hash.
Though you can use your custom salt and there is no need for salts to be persisted as it will always be included in the final hash result and can be retrieved.


## API

#### genSalt(cost)
Generates a random encryption salt. Returns the salt as a string.

| Parameter | Type          | Default | Description |
| --------- | ------------- |:-------:| ----------- |
| cost | integer between 4 and 31 inclusive | 10 | This value is logarithmic, the actual number of iterations is 2<sup>cost</sup> : increasing the cost by 1 doubles the computing time. |


#### hashSync(data, salt)
Returns the hashed data as a string.

| Parameter | Type          | Description |
| --------- | ------------- | ----------- |
| data      | string, Array or Uint8Array | the data to be encrypted. If a plain Array is given, its values will be clamped to the interval 0-255. Limited to 72 bytes. |
| salt      | string or number | The salt to be used in encryption, e.g. `"$2y$10$kjm.1j6Rxocp03XeNjMtsO"`. If specified as a cost number then a salt will be generated. If omitted, a salt is generated with the default cost value. |



#### hash(data, salt, progress, callback)
Hash some data asynchronously.

| Parameter | Type           | Description |
| --------- | -------------- | ----------- |
| data      | string, Array or Uint8Array | the data to be encrypted. If a plain Array is given, its values will be clamped to the interval 0-255. Limited to 72 bytes. |
| salt      | string or number | The salt to be used in encryption, e.g. `"$2y$10$kjm.1j6Rxocp03XeNjMtsO"`. If specified as a cost number then a salt will be generated. If omitted, a salt is generated with the default cost value. |
| progress  | function(p)    | a callback to be invoked with a value between 0 (exclusive) and 1 (inclusive) during the hash calculation to signify progress. This callback can return `false` to stop the process. |
| callback  | function(hash) | a callback to be fired with the computed hash once the data has been encrypted (and if the process has not been stopped). |


#### compareSync(password, refhash)
Returns true if the password matches, false if it doesn't. Throws an error if arguments are invalid.

| Parameter | Type   | Description                                   |
| --------- | -------| --------------------------------------------- |
| password  | string, Array or Uint8Array | password to check.  Limited to 72 bytes.                           |
| refhash   | string | reference hash to check the password against. |



#### compare(password, refhash, progress, callback)
Compares asynchronously a password against a hash.

| Parameter | Type   | Description                                   |
| --------- | -------| --------------------------------------------- |
| password  | string, Array or Uint8Array | password to check. Limited to 72 bytes.                           |
| refhash   | string | reference hash to check the password against. |
| progress  | function(p)    | a callback to be invoked with a value between 0 (exclusive) and 1 (inclusive) during the hash verification to signify progress. This callback can return `false` to stop the process. |
| callback  | function(result) | a callback to be fired once the data has been compared (and if the process has not been stopped). The argument is a boolean indicating whether the password and encrypted hash match. |



#### encodingMode
This property takes one of the two values:
* `ENCODING_UTF8` (default) - encodes non-ascii characters to utf-8 before hashing.
* `ENCODING_RAW` - does not encode non-ascii characters in the password. This allows the use of custom encodings.




## Character encoding
In order to provide support for unicode strings, passwords with non-ascii characters are utf-8 encoded by default before being hashed.
If a different encoding is desired, the password should be encoded before handing it to TwinBcrypt, and the following option should
be used :

`TwinBcrypt.encodingMode = TwinBcrypt.ENCODING_RAW;`


## Command-line
With a global installation:

    twin-bcrypt <cost> <password-to-hash>

With a local installation:

    node_modules/.bin/twin-bcrypt <cost> <password-to-hash>


## About prefixes
Back in the old days when all bcrypt-hashed passwords had the `$2a$` prefix, a bug was discovered in the crypt_blowfish implementation of this algorithm.
A small fraction of the `$2a$` passwords were buggy, but most of them were just fine. It was then decided to
[create two new prefixes](http://www.openwall.com/lists/oss-security/2011/06/21/16) to distinguish between them :

  * 2a - unknown correctness (may be correct, may be buggy)
  * 2x - sign extension bug
  * 2y - definitely correct

Twin-bcrypt uses the `$2y$` prefix by default, and can check correct `$2a$` passwords.
However it does not emulate the sign extension bug of old crypt_blowfish implementations, and thus doesn't recognize the legacy `$2x$` prefix.


## About asm.js
[asm.js](https://en.wikipedia.org/wiki/Asm.js) is an extraordinarily optimizable, low-level subset of JavaScript designed by Mozilla.
As a subset of JavaScript it runs in any browser, but until now only Firefox shows really outstanding performance. The V8 engine (used in Chrome and Node.js)
runs asm.js sometimes even slower than regular js.  
Twin-Bcrypt embeds two functionally identical bcrypt encoders : one is written in asm.js, the other one uses regular JavaScript. The asm.js encoder is
currently used only in the Firefox browser. This may evolve over time with JavaScript engines to always bring the best performance.


## Credits
This project is a fork of [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs), which is based on [javascript-bcrypt](https://code.google.com/p/javascript-bcrypt/), which is itself a
javascript port of damien miller's [jBCrypt](https://code.google.com/p/jbcrypt/).
