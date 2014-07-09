twin-bcrypt
===========

Pure JS implementation of the [BCrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm for Node and the browser without dependencies.
See the htpasswpd generator at http://aspirine.org/htpasswd_en.html for a live demo.


## Basic usage:
Synchronous
```
var hash = TwinBcrypt.hashSync("bacon");

TwinBcrypt.compareSync("bacon", hash); // true
TwinBcrypt.compareSync("veggies", hash); // false
```

Asynchronous
```
TwinBcrypt.hash("bacon", function(hash) {
  // Store hash in your password DB.
});

// Load hash from your password DB.
TwinBcrypt.compare("bacon", hash, function(res) {
    // res == true
});
TwinBcrypt.compare("veggies", hash, function(res) {
    // res = false
});
```

In the above examples, the salt is automatically generated and attached to the hash.
Though you can use your custom salt and there is no need for salts to be persisted as it will always be included in the final hash result and can be retrieved.


## API
* `genSalt(cost)`
    * `cost` - [OPTIONAL] - Integer between 4 and 31 inclusive. Default 10. This value is logarithmic, the actual number of iterations used will be 2<sup>cost</sup> : increasing the cost by 1 will double the amount of time taken.
* `hashSync(data, salt)`
    * `data` - [REQUIRED] - the data to be encrypted.
    * `salt` - [OPTIONAL] - the salt to be used in encryption. If specified as a number then a salt will be generated and used.
* `hash(data, salt, progress, cb)`
    * `data` - [REQUIRED] - the data to be encrypted.
    * `salt` - [OPTIONAL] - the salt to be used to hash the password. If specified as a number then a salt will be generated and used.
    * `progress` - [OPTIONAL] - a callback to be invoked during the hash calculation to signify progress.
        * `p` - Value between 0 (exclusive) and 1 (inclusive), sent as a parameter to the progress callback.
    * `callback` - [REQUIRED] - a callback to be fired once the data has been encrypted.
        * `result` - Hashed data received as an argument.
* `compareSync(password, refhash)`
    * `password` - [REQUIRED] - password to check.
    * `refhash` - [REQUIRED] - reference hash to check the password against.
    Returns true if the password matches, false if it doesn't. Throws an error if arguments are invalid.
* `compare(password, refhash, progress, cb)`
    * `password` - [REQUIRED] - password to check.
    * `refhash` - [REQUIRED] - reference hash to check the password against.
    * `progress` - [OPTIONAL] - a callback to be called during the hash verification to signify progress
        * `p` - Value between 0 (exclusive) and 1 (inclusive), sent as a parameter to the progress callback.
    * `callback` - [REQUIRED] - a callback to be fired once the data has been compared.
        * `result` - Boolean received as an argument to the callback, indicating whether the data and encrypted forms match.
* `encodingMode`
    * `ENCODING_UTF8` (default) - encodes non-ascii characters to utf-8 before hashing.
    * `ENCODING_RAW` - does not encode non-ascii characters in the password. This allows the use of custom encodings.


## Character encoding
In order to provide support for unicode strings, passwords with non-ascii characters are utf-8 encoded by default before being hashed.
If a different encoding is desired, the password should be encoded before handing it to TwinBcrypt, and the following option should
be used :

`TwinBcrypt.encodingMode = TwinBcrypt.ENCODING_RAW;`


## About prefixes
Back in the old days when all bcrypt-hashed passwords had the `$2a$` prefix, a bug was discovered in the crypt_blowfish implementation of this algorithm.
A small fraction of the `$2a$` passwords were buggy, but most of them were just fine. It was then decided to
[create two new prefixes](http://www.openwall.com/lists/oss-security/2011/06/21/16) to distinguish between them :

  * 2a - unknown correctness (may be correct, may be buggy)
  * 2x - sign extension bug
  * 2y - definitely correct

Twin-bcrypt uses the `$2y$` prefix by default, and can check correct `$2a$` passwords.
However it does not emulate the sign extension bug of old crypt_blowfish implementations, and thus doesn't recognize the legacy `$2x$` prefix.


## Credits
This project is a fork of [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs), which is based on [javascript-bcrypt](https://code.google.com/p/javascript-bcrypt/), which is itself a
javascript port of damien miller's [jBCrypt](https://code.google.com/p/jbcrypt/).

[node.bcrypt.js](https://github.com/ncb000gt/node.bcrypt.js.git)
