/* jshint expr: true, node: true */
/* global chai, describe, it, expect, TwinBcrypt, setTimeout */

/**
 * A trivial spy function.
 * Also check https://github.com/chaijs/chai-spies
 */
function Spy(func) {
    var count = 0, values = [];

    function sp(n) {
        count++;
        values.push(n);
        if (func) return func(n);
    }

    // Could be more expressive.
    // But it is essential to keep this as simple as possible.
    sp.should = {
        not: { have: { been: {
            called: function() { count.should.equal(0); }
        } } },
        have: { been: { called: {
            once: function() { count.should.equal(1); },
            at: { least : {
                once: function() { count.should.be.at.least(1); },
                twice: function() { count.should.be.at.least(2); },
            } }
        } } }
    };
    sp.lastValue = function() { return values[values.length-1]; };
    sp.penultimateValue = function() { return values[values.length-2]; };
    return sp;
}

describe('API test suite', function() {
    var SALT4 = '$2y$04$......................',
        SALT7 = '$2y$07$......................',
        HASH4 = '$2y$04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5Qdjhm',
        HASH7 = '$2y$07$......................rkNUWThr5KSHevvQDxRDSYaalST.SGy',
        COST_4_HASH = /^\$2y\$04\$[.\/A-Za-z0-9]{21}[.Oeu][.\/A-Za-z0-9]{30}[.CGKOSWaeimquy26]$/,
        COST_7_HASH = /^\$2y\$07\$[.\/A-Za-z0-9]{21}[.Oeu][.\/A-Za-z0-9]{30}[.CGKOSWaeimquy26]$/,
        DEFAULT_HASH = new RegExp('^\\$2y\\$'+TwinBcrypt.defaultCost+'\\$[./A-Za-z0-9]{21}[.Oeu][.\/A-Za-z0-9]{30}[.CGKOSWaeimquy26]$'),
        noop = function() {};

    describe('Salt', function() {
        var COST_4_SALT = /^\$2y\$04\$[.\/A-Za-z0-9]{21}[.Oeu]$/;
        var DEFAULT_SALT = new RegExp('^\\$2y\\$'+TwinBcrypt.defaultCost+'\\$[./A-Za-z0-9]{21}[.Oeu]$');

        it('should have a decent default cost parameter', function() {
            TwinBcrypt.defaultCost.should.be.within(10, 15);
        });

        it('should accept explicit cost parameter', function() {
            TwinBcrypt.genSalt(4).should.match(COST_4_SALT, 'as integer');
            TwinBcrypt.genSalt(4.8).should.match(COST_4_SALT, 'as float');
            TwinBcrypt.genSalt('4').should.match(COST_4_SALT, 'as string');
        });

        it('should be generated with default cost parameter', function() {
            TwinBcrypt.genSalt().should.match(DEFAULT_SALT);
        });

        it('should reject bad cost parameter', function() {
            expect(function() { TwinBcrypt.genSalt("abc"); }).to.throw(Error, /cost|rounds/, 'string');
            expect(function() { TwinBcrypt.genSalt(-1); }).to.throw(Error, /cost|rounds/, 'negative');
            expect(function() { TwinBcrypt.genSalt(0); }).to.throw(Error, /cost|rounds/, 'zero');
            expect(function() { TwinBcrypt.genSalt(3); }).to.throw(Error, /cost|rounds/, 'too low');
            expect(function() { TwinBcrypt.genSalt(32); }).to.throw(Error, /cost|rounds/, 'too high');
        });
    });

    describe('Hash', function() {
        describe('Synchronous', function() {
            it('should warn when no password is given', function() {
                expect(function() { TwinBcrypt.hashSync(); }).to.throw(Error, /password|data|argument/);
                expect(function() { TwinBcrypt.hashSync(4); }).to.throw(Error, /password|data|argument/);
                expect(function() { TwinBcrypt.hashSync(4, noop); }).to.throw(Error, /password|data|argument|salt/);
            });

            it('should be generated with explicit salt', function() {
                TwinBcrypt.hashSync('password', SALT4).should.equal(HASH4);
                TwinBcrypt.hashSync('', SALT4).should.equal('$2y$04$......................w74bL5gU7LSJClZClCa.Pkz14aTv/XO');
            });

            it('should be generated with salt given as a number', function() {
                TwinBcrypt.hashSync('password', 4).should.match(COST_4_HASH, 'as integer');
                TwinBcrypt.hashSync('password', 4.8).should.match(COST_4_HASH, 'as float');
                expect(function() { TwinBcrypt.hashSync('password', '4'); }).to.throw(Error, /salt/, 'as string');
            });

            it('should accept Array passwords', function() {
                TwinBcrypt.hashSync([112,97,115,115,119,111,114,100], 4).should.match(COST_4_HASH, 'Array');
                TwinBcrypt.hashSync(new Uint8Array([112,97,115,115,119,111,114,100]), 4).should.match(COST_4_HASH, 'Uint8Array');
                TwinBcrypt.hashSync([112+256,97-256,115,115,119,111,114,100], 4).should.match(COST_4_HASH, 'Array with out of bound values');
            });
            
            it('should be generated with default salt generation', function() {
                TwinBcrypt.hashSync('password').should.match(DEFAULT_HASH);
            });

            it('should reject bad salts', function() {
                expect(function() { TwinBcrypt.hashSync('password', '$2y$04$.....é................'); }).to.throw(Error, /salt/);
                expect(function() { TwinBcrypt.hashSync('password', '$2y$04$.............-........'); }).to.throw(Error, /salt/);
                expect(function() { TwinBcrypt.hashSync('password', '$2y$04$.....................'); }).to.throw(Error, /salt/);
                expect(function() { TwinBcrypt.hashSync('password', '$2y$04$.....................A'); }).to.throw(Error, /salt/);
            });

        });


        describe('Asynchronous', function() {
            it('should warn when no password is given', function() {
                expect(function() { TwinBcrypt.hash(noop); }).to.throw(Error, /password|data|argument/, '1 argument');
                expect(function() { TwinBcrypt.hash(undefined, noop); }).to.throw(Error, /password|data|argument/, '2 arguments');
                expect(function() { TwinBcrypt.hash(undefined, SALT4, noop); }).to.throw(Error, /password|data|argument/, '3 arguments');
                expect(function() { TwinBcrypt.hash(undefined, SALT4, noop, noop); }).to.throw(Error, /password|data|argument/, '4 arguments');
            });

            it('should warn when no callback is given', function() {
                expect(function() { TwinBcrypt.hash('password', SALT4); }).to.throw(Error, /callback/);
            });


            it('should warn when arguments are invalid', function() {
                expect(function() { TwinBcrypt.hash('password', noop, noop, SALT4); }).to.throw(Error, /salt|callback|argument/);
            });

            it('should reject bad salts', function() {
                expect(function() { TwinBcrypt.hashSync('password', '$2y$04$.....é................'); }).to.throw(Error, /salt/);
                expect(function() { TwinBcrypt.hashSync('password', '$2y$04$.............-........'); }).to.throw(Error, /salt/);
                expect(function() { TwinBcrypt.hashSync('password', '$2y$04$.....................'); }).to.throw(Error, /salt/);
                expect(function() { TwinBcrypt.hashSync('password', '$2y$04$.....................A'); }).to.throw(Error, /salt/);
            });

            it('should accept (password, callback)', function(done) {
                TwinBcrypt.hash('password', function(result) {
                    result.should.match(DEFAULT_HASH);
                    done();
                });
            });

            it('should accept (password, string_salt, callback)', function(done) {
                // Use SALT7 instead of SALT4 to check that done() is not called multiple times.
                TwinBcrypt.hash('password', SALT7, function(result) {
                    result.should.equal(HASH7);
                    done();
                });
            });
            
            it('should accept (string_password, number_salt, callback)', function(done) {
                TwinBcrypt.hash('password', 4, function(result) {
                    result.should.match(COST_4_HASH);
                    done();
                });
            });

            it('should accept (array_password, number_salt, callback)', function(done) {
                TwinBcrypt.hash([112,97,115,115,119,111,114,100], 4, function(result) {
                    result.should.match(COST_4_HASH);
                    done();
                });
            });

            it('should accept (array_password_with_out-of-bounds_values, number_salt, callback)', function(done) {
                TwinBcrypt.hash([112+256,97-256,115,115,119,111,114,100], 4, function(result) {
                    result.should.match(COST_4_HASH);
                    done();
                });
            });
            
            it('should accept (Uint8Array_password, number_salt, callback)', function(done) {
                TwinBcrypt.hash(new Uint8Array([112,97,115,115,119,111,114,100]), 4, function(result) {
                    result.should.match(COST_4_HASH);
                    done();
                });
            });
            
            it('should accept (password, progress, callback)', function(done) {
                var spy = Spy();
                TwinBcrypt.hash('password', spy, function(result) {
                    result.should.match(DEFAULT_HASH);
                    spy.should.have.been.called.at.least.twice();
                    spy.penultimateValue().should.be.below(1);
                    spy.lastValue().should.equal(1);
                    done();
                });
            });

            it('should be able to stop the process', function(done) {
                var progressSpy = Spy(function(p) { return false; });
                var callbackSpy = Spy();
                TwinBcrypt.hash('password', progressSpy, callbackSpy);
                setTimeout(function() {
                    callbackSpy.should.not.have.been.called();
                    progressSpy.should.have.been.called.once();
                    progressSpy.lastValue().should.be.below(1);
                    done();
                }, 400);
            });

            it('should accept (password, string_salt, progress, callback)', function(done) {
                var spy = Spy();
                TwinBcrypt.hash('password', SALT4, spy, function(result) {
                    result.should.equal(HASH4);
                    spy.should.have.been.called.at.least.once();
                    spy.lastValue().should.equal(1);
                    done();
                });
            });

            it('should accept (password, number_salt, progress, callback)', function(done) {
                var spy = Spy();
                TwinBcrypt.hash('password', 7, spy, function(result) {
                    result.should.match(COST_7_HASH);
                    spy.should.have.been.called.at.least.once();
                    done();
                });
            });

            it('should not overflow when cost = 31', function(done) {
                TwinBcrypt.hash('password', 31, function(p) {
                    p.should.be.below(1e-7);
                    done();
                    return false;
                }, function(result) {});
            });

        });
    });


    describe('Compare', function() {
        var SALT4 = '$2y$04$......................',
            SALT7 = '$2y$07$......................',
            HASH4 = '$2y$04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5Qdjhm',
            HASH7 = '$2y$07$......................rkNUWThr5KSHevvQDxRDSYaalST.SGy',
            COST_4_HASH = /^\$2a\$04\$[.\/A-Za-z0-9]{21}[.Oeu][.\/A-Za-z0-9]{30}[.CGKOSWaeimquy26]$/,
            COST_7_HASH = /^\$2a\$07\$[.\/A-Za-z0-9]{21}[.Oeu][.\/A-Za-z0-9]{30}[.CGKOSWaeimquy26]$/,
            DEFAULT_HASH = new RegExp('^\\$2a\\$'+TwinBcrypt.defaultCost+'\\$[./A-Za-z0-9]{21}[.Oeu][.\/A-Za-z0-9]{30}[.CGKOSWaeimquy26]$'),
            noop = function() {};

        describe('Synchronous', function() {
            it('should throw when arguments are incomplete or invalid', function() {
                expect(function() { TwinBcrypt.compareSync(); }).to.throw(Error, /password|data|argument/);
                expect(function() { TwinBcrypt.compareSync('password'); }).to.throw(Error, /data|argument/);
                expect(function() { TwinBcrypt.compareSync('password', 4); }).to.throw(Error, /data|argument/);
                expect(function() {
                    TwinBcrypt.compareSync('password', '$2y$04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5QdjhmA');
                }).to.throw(Error, /data|argument/);
                expect(function() {
                    TwinBcrypt.compareSync('password', '$2y$04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5Qdjh');
                }).to.throw(Error, /data|argument/);
                expect(function() {
                    TwinBcrypt.compareSync('password', '$2a!04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5Qdjhm').to.be.false;
                }).to.throw(Error, /data|argument/);
                expect(function() {
                    TwinBcrypt.compareSync('password', '$2b$04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5Qdjhm').to.be.false;
                }).to.throw(Error, /data|argument/);
                expect(function() {
                    TwinBcrypt.compareSync('password', '$3a$04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5Qdjhm').to.be.false;
                }).to.throw(Error, /data|argument/);
                expect(function() {
                    TwinBcrypt.compareSync('password', '$2y$K4$......................LAtw7/ohmmBAhnXqmkuIz83Rl5Qdjhm').to.be.false;
                }).to.throw(Error, /data|argument/);
            });

            it('should accept Array passwords', function() {
                // 'password' === [112,97,115,115,119,111,114,100]
                TwinBcrypt.compareSync([112,97,115,115,119,111,114,100], HASH4).should.equal(true, 'Array');
                TwinBcrypt.compareSync(new Uint8Array([112,97,115,115,119,111,114,100]), HASH4).should.equal(true, 'Uint8Array');
                TwinBcrypt.compareSync([112+256,97-256,115,115,119,111,114,100], HASH4).should.equal(true, 'Array with out of bound values');
            });
            
            it('should return false when the password is wrong', function() {
                TwinBcrypt.compareSync('wrong', HASH4).should.be.false;
            });

            it('should return false when the password as an Array is wrong', function() {
                // 'wrong' === [119,114,111,110,103]
                TwinBcrypt.compareSync([119,114,111,110,103], HASH4).should.be.false;
            });

            it('should return true when the password is correct', function() {
                TwinBcrypt.compareSync('password', HASH4).should.be.true;
            });
        });


        describe('Asynchronous', function() {
            it('should warn when given invalid or incomplete arguments', function() {
                expect(function() { TwinBcrypt.compare(); }).to.throw(Error, /password|data|argument/);
                expect(function() { TwinBcrypt.compare('password'); }).to.throw(Error, /data|argument|callback/);
                expect(function() { TwinBcrypt.compare('password', 4); }).to.throw(Error, /data|argument/);
                expect(function() {
                    TwinBcrypt.compare('password', '$2y$04$......................LAtw7/ohmmBAhnXqmkuIz83Rl5QdjhmA', noop);
                }).to.throw(Error, /data|argument/);
                expect(function() { TwinBcrypt.compare('password', HASH4); }).to.throw(Error, /argument|callback/);
                expect(function() { TwinBcrypt.compare('password', noop); }).to.throw(Error, /argument|callback/);
                expect(function() { TwinBcrypt.compare(noop, 'password', HASH4); }).to.throw(Error, /argument|callback/);
                expect(function() { TwinBcrypt.compare('password', 4, noop); }).to.throw(Error, /argument|salt/);
                expect(function() { TwinBcrypt.compare('password', 4, noop, noop); }).to.throw(Error, /argument|salt/);
            });

            it('should accept (string_password, hash, callback)', function(done) {
                TwinBcrypt.compare('password', HASH4, function(result) {
                    result.should.be.true;
                    done();
                });
            });

            it('should accept (array_password, number_salt, callback)', function(done) {
                TwinBcrypt.compare([112,97,115,115,119,111,114,100], HASH4, function(result) {
                    result.should.be.true;
                    done();
                });
            });

            it('should accept (array_password_with_out-of-bounds_values, number_salt, callback)', function(done) {
                TwinBcrypt.compare([112+256,97-256,115,115,119,111,114,100], HASH4, function(result) {
                    result.should.be.true;
                    done();
                });
            });
            
            it('should accept (Uint8Array_password, number_salt, callback)', function(done) {
                TwinBcrypt.compare(new Uint8Array([112,97,115,115,119,111,114,100]), HASH4, function(result) {
                    result.should.be.true;
                    done();
                });
            });
            
            it('should return false but not throw when called with (wrong string_password, hash, callback)', function(done) {
                TwinBcrypt.compare('wrong', HASH4, function(result) {
                    result.should.be.false;
                    done();
                });
            });

            it('should return false but not throw when called with (wrong array_password, hash, callback)', function(done) {
                TwinBcrypt.compare([119,114,111,110,103], HASH4, function(result) {
                    result.should.be.false;
                    done();
                });
            });
            
            it('should accept (password, hash, progress, callback)', function(done) {
                var spy = Spy();
                TwinBcrypt.compare('password', HASH7, spy, function(result) {
                    result.should.be.true;
                    spy.should.have.been.called.at.least.once();
                    done();
                });
            });

        });
    });

});
