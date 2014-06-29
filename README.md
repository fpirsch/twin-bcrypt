twin-bcrypt
===========

Pure JS implementation of the [BCrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm for Node and the browser without dependencies.
See the htpasswpd generator at http://aspirine.org/htpasswd_en.html for a live demo.

## TODO:
This is work in progress...

The test coverage is getting quite good. Most tests pass, but some still fail. That's how [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) works. Think of those failing tests not as flaws but as a TODO list : the initial project had a number of weaknesses and that's the point of creating twin-bcrypt.


## Basic usage:
Synchronous
```
var hash = TwinBcrypt.hashSync("bacon");

TwinBcrypt.compareSync("bacon", hash); // true
TwinBcrypt.compareSync("veggies", hash); // false
```

Asynchronous
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
* `genSalt(cost)`
    * `cost` - [OPTIONAL] - Default 10. This value is logarithmic, the actual number of iterations used will be 2<sup>cost</sup> : increasing the cost by 1 will double the amount of time taken.
* `hashSync(data, salt)`
    * `data` - [REQUIRED] - the data to be encrypted.
    * `salt` - [REQUIRED] - the salt to be used in encryption. If specified as a number then a salt will be generated and used.
* `hash(data, salt, progress, cb)`
    * `data` - [REQUIRED] - the data to be encrypted.
    * `salt` - [REQUIRED] - the salt to be used to hash the password. If specified as a number then a salt will be generated and used.
    * `progress` - [OPTIONAL] - a callback to be called during the hash calculation to signify progress
    * `callback` - [REQUIRED] - a callback to be fired once the data has been encrypted.
        * `error` - First parameter to the callback detailing any errors.
        * `result` - Second parameter to the callback providing the encrypted form.
* `compareSync(password, refhash)`
    * `password` - [REQUIRED] - password to check.
    * `refhash` - [REQUIRED] - reference hash to check the password against.
    Returns true if the password matches, false if it doesn't. Throws an error if arguments are invalid.
* `compare(password, refhash, progress, cb)`
    * `password` - [REQUIRED] - password to check.
    * `refhash` - [REQUIRED] - reference hash to check the password against.
    * `progress` - [OPTIONAL] - a callback to be called during the hash verification to signify progress
    * `callback` - [REQUIRED] - a callback to be fired once the data has been compared.
        * `error` - First parameter to the callback detailing any errors.
        * `result` - Second parameter to the callback providing whether the data and encrypted forms match [true | false].


## Credits
This project is a fork of [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs), which is based on [javascript-bcrypt](https://code.google.com/p/javascript-bcrypt/), which is itself a
javascript port of damien miller's [jBCrypt](https://code.google.com/p/jbcrypt/).

[node.bcrypt.js](https://github.com/ncb000gt/node.bcrypt.js.git)
