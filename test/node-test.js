/* jshint node: true*/

global.should = require('chai').should();
global.TwinBcrypt = require("../twin-bcrypt");

require('./testsuite-jbcrypt.js');
require('./testsuite-crypt-blowfish.js');
