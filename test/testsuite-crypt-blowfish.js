/* jshint node: true, expr: true */
/* global describe, it, should, TwinBcrypt */

String.prototype.repeat = function(n) { return Array(n+1).join(this); };

// This test suite comes from the GNU Openwall implementation of the bcrypt algorithm in C.
// It can be found at http://www.openwall.com/crypt/
describe('crypt_blowfish test suite', function() {

    it('should hash with the $2a$ prefix', function() {
        TwinBcrypt.compareSync("U*U", "$2a$05$CCCCCCCCCCCCCCCCCCCCC.E5YPO9kmyuRGyh0XouQYb4YMJKvyOeW").should.be.true;
        TwinBcrypt.compareSync("U*U*", "$2a$05$CCCCCCCCCCCCCCCCCCCCC.VGOzA784oUp/Z0DY336zx7pLYAy0lwK").should.be.true;
        TwinBcrypt.compareSync("U*U*U", "$2a$05$XXXXXXXXXXXXXXXXXXXXXOAcXxm9kjPGEMsLznoKqmqw7tc8WCx4a").should.be.true;
        TwinBcrypt.compareSync("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789chars after 72 are ignored", "$2a$05$abcdefghijklmnopqrstuu5s2v8.iXieOjg/.AySBTTZIIVFJeBui").should.be.true;
    });

    // This test fails miserably. jBCrypt and its later ports were never meant to handle $2x$ and $2y$ :-(
    it('should handle $2a$, $2x$ and $2y$ prefixes', function() {
        TwinBcrypt.compareSync("\xa3", "$2x$05$/OK.fbVrR/bpIqNJ5ianF.CE5elHaaO4EbggVDjb8P19RukzXSM3e").should.be.true;
        TwinBcrypt.compareSync("\xff\xff\xa3", "$2x$05$/OK.fbVrR/bpIqNJ5ianF.CE5elHaaO4EbggVDjb8P19RukzXSM3e").should.be.true;
        TwinBcrypt.compareSync("\xff\xff\xa3", "$2y$05$/OK.fbVrR/bpIqNJ5ianF.CE5elHaaO4EbggVDjb8P19RukzXSM3e").should.be.true;
        TwinBcrypt.compareSync("\xff\xff\xa3", "$2a$05$/OK.fbVrR/bpIqNJ5ianF.nqd1wy.pTMdcvrRWxyiGL2eMz.2a85.").should.be.true;
        TwinBcrypt.compareSync("\xa3", "$2y$05$/OK.fbVrR/bpIqNJ5ianF.Sa7shbm4.OzKpvFnX1pQLmQW96oUlCq").should.be.true;
        TwinBcrypt.compareSync("\xa3", "$2a$05$/OK.fbVrR/bpIqNJ5ianF.Sa7shbm4.OzKpvFnX1pQLmQW96oUlCq").should.be.true;
        TwinBcrypt.compareSync("1\xa3345", "$2x$05$/OK.fbVrR/bpIqNJ5ianF.o./n25XVfn6oAPaUvHe.Csk4zRfsYPi").should.be.true;
        TwinBcrypt.compareSync("\xff\xa3345", "$2x$05$/OK.fbVrR/bpIqNJ5ianF.o./n25XVfn6oAPaUvHe.Csk4zRfsYPi").should.be.true;
        TwinBcrypt.compareSync("\xff\xa334\xff\xff\xff\xa3345", "$2x$05$/OK.fbVrR/bpIqNJ5ianF.o./n25XVfn6oAPaUvHe.Csk4zRfsYPi").should.be.true;
        TwinBcrypt.compareSync("\xff\xa334\xff\xff\xff\xa3345", "$2y$05$/OK.fbVrR/bpIqNJ5ianF.o./n25XVfn6oAPaUvHe.Csk4zRfsYPi").should.be.true;
        TwinBcrypt.compareSync("\xff\xa334\xff\xff\xff\xa3345", "$2a$05$/OK.fbVrR/bpIqNJ5ianF.ZC1JEJ8Z4gPfpe1JOr/oyPXTWl9EFd.").should.be.true;
        TwinBcrypt.compareSync("\xff\xa3345", "$2y$05$/OK.fbVrR/bpIqNJ5ianF.nRht2l/HRhr6zmCp9vYUvvsqynflf9e").should.be.true;
        TwinBcrypt.compareSync("\xff\xa3345", "$2a$05$/OK.fbVrR/bpIqNJ5ianF.nRht2l/HRhr6zmCp9vYUvvsqynflf9e").should.be.true;
        TwinBcrypt.compareSync("\xa3ab", "$2a$05$/OK.fbVrR/bpIqNJ5ianF.6IflQkJytoRVc1yuaNtHfiuq.FRlSIS").should.be.true;
        TwinBcrypt.compareSync("\xa3ab", "$2x$05$/OK.fbVrR/bpIqNJ5ianF.6IflQkJytoRVc1yuaNtHfiuq.FRlSIS").should.be.true;
        TwinBcrypt.compareSync("\xa3ab", "$2y$05$/OK.fbVrR/bpIqNJ5ianF.6IflQkJytoRVc1yuaNtHfiuq.FRlSIS").should.be.true;
        TwinBcrypt.compareSync("\xd1\x91", "$2x$05$6bNw2HLQYeqHYyBfLMsv/OiwqTymGIGzFsA4hOTWebfehXHNprcAS").should.be.true;
        TwinBcrypt.compareSync("\xd0\xc1\xd2\xcf\xcc\xd8", "$2x$05$6bNw2HLQYeqHYyBfLMsv/O9LIGgn8OMzuDoHfof8AQimSGfcSWxnS").should.be.true;
        TwinBcrypt.compareSync("\xaa".repeat(72) + "chars after 72 are ignored as usual", "$2a$05$/OK.fbVrR/bpIqNJ5ianF.swQOIzjOiJ9GHEPuhEkvqrUyvWhEMx6").should.be.true;
        TwinBcrypt.compareSync("\xaa\x55".repeat(36), "$2a$05$/OK.fbVrR/bpIqNJ5ianF.R9xrDjiycxMbQE2bp.vgqlYpW5wx2yy").should.be.true;
        TwinBcrypt.compareSync("\x55\xaa\xff".repeat(24), "$2a$05$/OK.fbVrR/bpIqNJ5ianF.9tQZzcJfm3uj2NvJ/n5xkhpqLrMpWCe").should.be.true;
    });

    it('should hash an empty password', function() {
        TwinBcrypt.compareSync("", "$2a$05$CCCCCCCCCCCCCCCCCCCCC.7uG0VCzI2bS7j6ymqJi9CdcdxiRTWNy").should.be.true;
    });

    it('should reject bad salts', function() {
        should.Throw(function() { TwinBcrypt.hashSync("some password", "$2a$03$CCCCCCCCCCCCCCCCCCCCC."); }, /cost|rounds|salt/);
        should.Throw(function() { TwinBcrypt.hashSync("some password", "$2a$32$CCCCCCCCCCCCCCCCCCCCC."); }, /cost|rounds|salt/);
        should.Throw(function() { TwinBcrypt.hashSync("some password", "$2z$05$CCCCCCCCCCCCCCCCCCCCC."); }, /salt|prefix|salt/);
        should.Throw(function() { TwinBcrypt.hashSync("some password", "$2`$05$CCCCCCCCCCCCCCCCCCCCC."); }, /salt|prefix|salt/);
        should.Throw(function() { TwinBcrypt.hashSync("some password", "$2{$05$CCCCCCCCCCCCCCCCCCCCC."); }, /salt|prefix|salt/);
    });


});
