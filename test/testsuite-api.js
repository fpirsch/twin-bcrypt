/* jshint expr: true */
/* global chai, describe, it, expect, TwinBcrypt */

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
            expect(function() { TwinBcrypt.genSaltSync("abc"); }).to.throw(Error, /cost|rounds/, 'string');
            expect(function() { TwinBcrypt.genSaltSync(-1); }).to.throw(Error, /cost|rounds/, 'negative');
            expect(function() { TwinBcrypt.genSaltSync(0); }).to.throw(Error, /cost|rounds/, 'zero');
            expect(function() { TwinBcrypt.genSaltSync(3); }).to.throw(Error, /cost|rounds/, 'too low');
            expect(function() { TwinBcrypt.genSaltSync(32); }).to.throw(Error, /cost|rounds/, 'too high');
        });
    });

    describe('Hash', function() {
        var SALT = '$2a$04$......................',
            HASH4 = '$2a$04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5Qdjhm',
            COST_4_HASH = /^\$2a\$04\$[.\/A-Za-z0-9]{21}[.Oeu][.\/A-Za-z0-9]{30}[.CGKOSWaeimquy2]$/,
            DEFAULT_HASH = new RegExp('^\\$2a\\$'+TwinBcrypt.defaultCost+'\\$[./A-Za-z0-9]{21}[.Oeu][.\/A-Za-z0-9]{30}[.CGKOSWaeimquy2]$'),
            noop = function() {};

        describe('Synchronous', function() {
            it('should warn when no password is given', function() {
                expect(function() { TwinBcrypt.hashSync(); }).to.throw(Error);
            });

            it('should be generated with explicit salt', function() {
                TwinBcrypt.hashSync('password', SALT).should.equal(HASH4);
                TwinBcrypt.hashSync('', SALT).should.equal('$2a$04$......................w74bL5gU7LSJClZClCa.Pkz14aTv/XO');
            });

            it('should be generated with salt given as a number', function() {
                TwinBcrypt.hashSync('password', 4).should.match(COST_4_HASH, 'as integer');
                TwinBcrypt.hashSync('password', 4.8).should.match(COST_4_HASH, 'as float');
                TwinBcrypt.hashSync('password', '4').should.match(COST_4_HASH, 'as string');
            });

            it('should be generated with default salt generation', function() {
                TwinBcrypt.hashSync('password').should.match(DEFAULT_HASH);
            });
        });


        describe('Asynchronous', function() {
            it('should warn when no password is given', function() {
                expect(function() { TwinBcrypt.hash(noop); }).to.throw(Error, /password|data/, '1 argument');
                expect(function() { TwinBcrypt.hash(undefined, SALT, noop, noop); }).to.throw(Error, /password|data/, '4 arguments');
            });

            it('should warn when no callback is given', function() {
                expect(function() { TwinBcrypt.hash('password', SALT); }).to.throw(Error, /callback/);
            });


            it('should be generated with an explicit salt', function(done) {
                TwinBcrypt.hash('password', SALT, function(error, result) {
                    expect(error).to.not.exist;
                    result.should.equal(HASH4);
                    done();
                });
                var spy = chai.spy(noop);
                TwinBcrypt.hash('password', SALT, spy, function(error, result) {
                    expect(error).to.not.exist;
                    result.should.equal(HASH4);
                    spy.should.have.been.called();
                    done();
                });
            });

            it('should be generated asynchronously with an explicit cost parameter', function(done) {
                TwinBcrypt.hash('password', 4, function(error, result) {
                    expect(error).to.not.exist;
                    result.should.equal(HASH4);
                    done();
                });
            });

            it('should reject an invalid salt', function(done) {
                TwinBcrypt.hash('password', '$2a$04$.............', function(error, result) {
                    expect(error).to.match(/salt/);
                    expect(result).to.not.exist;
                    done();
                });
            });

        });
    });


/*
hashSync(data, salt)

    data - [REQUIRED] - the data to be encrypted.
    salt - [OPTIONAL] - the salt to be used to hash the password. If specified as a number then a salt will be generated and used (see examples).

hash(data, salt, progress, cb)

    data - [REQUIRED] - the data to be encrypted.
    salt - [OPTIONAL] - the salt to be used to hash the password. If specified as a number then a salt will be generated and used (see examples).
    progress - [OPTIONAL] - a callback to be called during the hash calculation to signify progress
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
