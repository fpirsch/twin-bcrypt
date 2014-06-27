/* jshint node: true*/

global.should = require('chai').should();
global.expect = require('chai').expect;
global.TwinBcrypt = require("../twin-bcrypt.min.js");

require('./testsuite-api.js');
require('./testsuite-jbcrypt.js');
require('./testsuite-crypt-blowfish.js');
