twin-bcrypt
===========

Pure JS implementation of the [BCrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm for Node and the browser without dependencies.
See the htpasswpd generator at http://aspirine.org/htpasswd_en.html for a live demo.

## TODO:
This is work in progress...
The first thing to do is to set up a decent set of tests. The jBCrypt test passes :-)

The crypt_blowfish test suite fails, however. Non-ascii chars and $2x$ / $2y$ prefixes seem to be an issue.


## Basic usage:
Synchronous
```
var hash = TwinBcrypt.hashSync("bacon");

TwinBcrypt.compareSync("bacon", hash); // true
TwinBcrypt.compareSync("veggies", hash); // false
```

Asynchronous (not in browsers yet)
```
TwinBcrypt.hash("bacon", null, null, function(err, hash) {
  // Store hash in your password DB.
});

// Load hash from your password DB.
TwinBcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
TwinBcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});
```

In the above examples, the salt is automatically generated and attached to the hash.
Though you can use your custom salt and there is no need for salts to be persisted as it will always be included in the final hash result and can be retrieved.

## API
* `genSaltSync(cost)`
    * `cost` - [OPTIONAL] - Default 10. This value is logarithmic, the actual number of iterations used will be 2**cost – increasing the cost by +1 will double the amount of time taken.
* `genSalt(cost, callback)`
    * `cost` - [OPTIONAL] - Default 10. This value is logarithmic, the actual number of iterations used will be 2**cost – increasing the cost by +1 will double the amount of time taken.
    * `callback` - [REQUIRED] - a callback to be fired once the salt has been generated.
        * `error` - First parameter to the callback detailing any errors.
        * `result` - Second parameter to the callback providing the generated salt.
* `hashSync(data, salt)`
    * `data` - [REQUIRED] - the data to be encrypted.
    * `salt` - [REQUIRED] - the salt to be used in encryption. If specified as a number then a salt will be generated and used.
* `hash(data, salt, progress, cb)`
    * `data` - [REQUIRED] - the data to be encrypted.
    * `salt` - [REQUIRED] - the salt to be used to hash the password. If specified as a number then a salt will be generated and used.
    * `progress` - a callback to be called during the hash calculation to signify progress
    * `callback` - [REQUIRED] - a callback to be fired once the data has been encrypted.
        * `error` - First parameter to the callback detailing any errors.
        * `result` - Second parameter to the callback providing the encrypted form.
* `compareSync(data, encrypted)`
    * `data` - [REQUIRED] - data to compare.
    * `encrypted` - [REQUIRED] - data to be compared to.
* `compare(data, encrypted, cb)`
    * `data` - [REQUIRED] - data to compare.
    * `encrypted` - [REQUIRED] - data to be compared to.
    * `callback` - [REQUIRED] - a callback to be fired once the data has been compared.
        * `error` - First parameter to the callback detailing any errors.
        * `result` - Second parameter to the callback providing whether the data and encrypted forms match [true | false].


## Credits
This project is a fork of [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs), which is based on [javascript-bcrypt](https://code.google.com/p/javascript-bcrypt/), which is itself a
javascript port of damien miller's [jBCrypt](https://code.google.com/p/jbcrypt/).

[node.bcrypt.js](https://github.com/ncb000gt/node.bcrypt.js.git)
