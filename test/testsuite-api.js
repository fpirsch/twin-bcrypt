/* jshint expr: true */
/* global describe, it, expect, TwinBcrypt */

describe('API test suite', function() {


    describe('Salt', function() {
        var COST_4_SALT = /^\$2a\$04\$[.\/A-Za-z0-9]{21}[.Oeu]$/;
        var DEFAULT_SALT = new RegExp('^\\$2a\\$'+TwinBcrypt.defaultCost+'\\$[./A-Za-z0-9]{21}[.Oeu]$');

        it('should have a decent default cost parameter', function() {
            TwinBcrypt.defaultCost.should.be.within(10, 15);
        });

        it('should be generated with explicit cost parameter', function() {
            TwinBcrypt.genSaltSync(4).should.match(COST_4_SALT, 'as integer');
            TwinBcrypt.genSaltSync(4.8).should.match(COST_4_SALT, 'as float');
            TwinBcrypt.genSaltSync('4').should.match(COST_4_SALT, 'as string');
        });

        it('should be generated with default cost parameter', function() {
            TwinBcrypt.genSaltSync().should.match(DEFAULT_SALT);
        });

        it('should reject bad cost parameter', function() {
            expect(function() { TwinBcrypt.genSaltSync("abc"); }).to.throw(Error, /cost|rounds/, "string");
            expect(function() { TwinBcrypt.genSaltSync(-1); }).to.throw(Error, /cost|rounds/, "negative");
            expect(function() { TwinBcrypt.genSaltSync(0); }).to.throw(Error, /cost|rounds/, "zero");
            expect(function() { TwinBcrypt.genSaltSync(3); }).to.throw(Error, /cost|rounds/, "too low");
            expect(function() { TwinBcrypt.genSaltSync(32); }).to.throw(Error, /cost|rounds/, "too high");
        });

        it('should be generated asynchronously with a default cost parameter', function(done) {
            TwinBcrypt.genSalt(function(error, result) {
                expect(error).to.not.exist;
                result.should.match(DEFAULT_SALT);
                done();
            });
        });

        it('should be generated asynchronously with an explicit cost parameter', function(done) {
            TwinBcrypt.genSalt(4, function(error, result) {
                expect(error).to.not.exist;
                result.should.match(COST_4_SALT);
                done();
            });
        });
        
        it('should reject a bad cost parameter in asynchrounous mode', function(done) {
            TwinBcrypt.genSalt(32, function(error, result) {
                error.should.match(/cost/);
                expect(result).to.not.exist;
                done();
            });
        });

        it('should warn when no callback is given in asynchrounous mode', function() {
            expect(function() { TwinBcrypt.genSalt(4); }).to.throw(Error);
        });

    });

/*
hashSync(data, salt)

    data - [REQUIRED] - the data to be encrypted.
    salt - [REQUIRED] - the salt to be used to hash the password. If specified as a number then a salt will be generated and used (see examples).

hash(data, salt, progress, cb)

    data - [REQUIRED] - the data to be encrypted.
    salt - [REQUIRED] - the salt to be used to hash the password. If specified as a number then a salt will be generated and used (see examples).
    progress - a callback to be called during the hash calculation to signify progress
    callback - [REQUIRED] - a callback to be fired once the data has been encrypted.
        error - First parameter to the callback detailing any errors.
        result - Second parameter to the callback providing the encrypted form.

compareSync(data, encrypted)

    data - [REQUIRED] - data to compare.
    encrypted - [REQUIRED] - data to be compared to.

compare(data, encrypted, cb)

    data - [REQUIRED] - data to compare.
    encrypted - [REQUIRED] - data to be compared to.
    callback - [REQUIRED] - a callback to be fired once the data has been compared.
        error - First parameter to the callback detailing any errors.
        result - Second parameter to the callback providing whether the data and encrypted forms match [true | false].

*/

});
