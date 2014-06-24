/* jshint node: true, expr: true */
/* global describe, before, it */

var should = require('chai').should(),
    bCrypt = require("../twin-bcrypt");

describe('Test Sync', function() {
    console.log('This suite takes a few seconds to run.');

    // Passes in 14s on my computer
    var jbcrypt_test_suite = [
        { pw: "", hash: "$2a$06$DCq7YPn5Rq63x1Lad4cll.TV4S6ytwfsfvkgY8jIucDrjc8deX1s." },
        { pw: "", hash: "$2a$08$HqWuK6/Ng6sg9gQzbLrgb.Tl.ZHfXLhvt/SgVyWhQqgqcZ7ZuUtye" },
        { pw: "", hash: "$2a$10$k1wbIrmNyFAPwPVPSVa/zecw2BCEnBwVS2GbrmgzxFUOqW9dk4TCW" },
        { pw: "", hash: "$2a$12$k42ZFHFWqBp3vWli.nIn8uYyIkbvYRvodzbfbK18SSsY.CsIQPlxO" },
        { pw: "a", hash: "$2a$06$m0CrhHm10qJ3lXRY.5zDGO3rS2KdeeWLuGmsfGlMfOxih58VYVfxe" },
        { pw: "a", hash: "$2a$08$cfcvVd2aQ8CMvoMpP2EBfeodLEkkFJ9umNEfPD18.hUF62qqlC/V." },
        { pw: "a", hash: "$2a$10$k87L/MF28Q673VKh8/cPi.SUl7MU/rWuSiIDDFayrKk/1tBsSQu4u" },
        { pw: "a", hash: "$2a$12$8NJH3LsPrANStV6XtBakCez0cKHXVxmvxIlcz785vxAIZrihHZpeS" },
        { pw: "abc", hash: "$2a$06$If6bvum7DFjUnE9p2uDeDu0YHzrHM6tf.iqN8.yx.jNN1ILEf7h0i" },
        { pw: "abc", hash: "$2a$08$Ro0CUfOqk6cXEKf3dyaM7OhSCvnwM9s4wIX9JeLapehKK5YdLxKcm" },
        { pw: "abc", hash: "$2a$10$WvvTPHKwdBJ3uk0Z37EMR.hLA2W6N9AEBhEgrAOljy2Ae5MtaSIUi" },
        { pw: "abc", hash: "$2a$12$EXRkfkdmXn2gzds2SSitu.MW9.gAVqa9eLS1//RYtYCmB1eLHg.9q" },
        { pw: "abcdefghijklmnopqrstuvwxyz", hash: "$2a$06$.rCVZVOThsIa97pEDOxvGuRRgzG64bvtJ0938xuqzv18d3ZpQhstC" },
        { pw: "abcdefghijklmnopqrstuvwxyz", hash: "$2a$08$aTsUwsyowQuzRrDqFflhgekJ8d9/7Z3GV3UcgvzQW3J5zMyrTvlz." },
        { pw: "abcdefghijklmnopqrstuvwxyz", hash: "$2a$10$fVH8e28OQRj9tqiDXs1e1uxpsjN0c7II7YPKXua2NAKYvM6iQk7dq" },
        { pw: "abcdefghijklmnopqrstuvwxyz", hash: "$2a$12$D4G5f18o7aMMfwasBL7GpuQWuP3pkrZrOAnqP.bmezbMng.QwJ/pG" },
        { pw: "~!@#$%^&*()      ~!@#$%^&*()PNBFRD", hash: "$2a$06$fPIsBO8qRqkjj273rfaOI.HtSV9jLDpTbZn782DC6/t7qT67P6FfO" },
        { pw: "~!@#$%^&*()      ~!@#$%^&*()PNBFRD", hash: "$2a$08$Eq2r4G/76Wv39MzSX262huzPz612MZiYHVUJe/OcOql2jo4.9UxTW" },
        { pw: "~!@#$%^&*()      ~!@#$%^&*()PNBFRD", hash: "$2a$10$LgfYWkbzEvQ4JakH7rOvHe0y8pHKF9OaFgwUZ2q7W2FFZmZzJYlfS" },
        { pw: "~!@#$%^&*()      ~!@#$%^&*()PNBFRD", hash: "$2a$12$WApznUOJfkEGSmYRfnkrPOr466oFDCaj4b6HY3EXGvfxm43seyhgC" },
    ];

    String.prototype.repeat = function(n) { return Array(n+1).join(this); };
    
    // Fails miserably for now.
    var crypt_blowfish_test_suite = [
        { hash: "$2a$05$CCCCCCCCCCCCCCCCCCCCC.E5YPO9kmyuRGyh0XouQYb4YMJKvyOeW", key: "U*U" },
        { hash: "$2a$05$CCCCCCCCCCCCCCCCCCCCC.VGOzA784oUp/Z0DY336zx7pLYAy0lwK", key: "U*U*" },
        { hash: "$2a$05$XXXXXXXXXXXXXXXXXXXXXOAcXxm9kjPGEMsLznoKqmqw7tc8WCx4a", key: "U*U*U" },
        { hash: "$2a$05$abcdefghijklmnopqrstuu5s2v8.iXieOjg/.AySBTTZIIVFJeBui", key: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789chars after 72 are ignored" },
        { hash: "$2x$05$/OK.fbVrR/bpIqNJ5ianF.CE5elHaaO4EbggVDjb8P19RukzXSM3e", key: "\xa3" },
        { hash: "$2x$05$/OK.fbVrR/bpIqNJ5ianF.CE5elHaaO4EbggVDjb8P19RukzXSM3e", key: "\xff\xff\xa3" },
        { hash: "$2y$05$/OK.fbVrR/bpIqNJ5ianF.CE5elHaaO4EbggVDjb8P19RukzXSM3e", key: "\xff\xff\xa3" },
        { hash: "$2a$05$/OK.fbVrR/bpIqNJ5ianF.nqd1wy.pTMdcvrRWxyiGL2eMz.2a85.", key: "\xff\xff\xa3" },
        { hash: "$2y$05$/OK.fbVrR/bpIqNJ5ianF.Sa7shbm4.OzKpvFnX1pQLmQW96oUlCq", key: "\xa3" },
        { hash: "$2a$05$/OK.fbVrR/bpIqNJ5ianF.Sa7shbm4.OzKpvFnX1pQLmQW96oUlCq", key: "\xa3" },
        { hash: "$2x$05$/OK.fbVrR/bpIqNJ5ianF.o./n25XVfn6oAPaUvHe.Csk4zRfsYPi", key: "1\xa3345" },
        { hash: "$2x$05$/OK.fbVrR/bpIqNJ5ianF.o./n25XVfn6oAPaUvHe.Csk4zRfsYPi", key: "\xff\xa3345" },
        { hash: "$2x$05$/OK.fbVrR/bpIqNJ5ianF.o./n25XVfn6oAPaUvHe.Csk4zRfsYPi", key: "\xff\xa334\xff\xff\xff\xa3345" },
        { hash: "$2y$05$/OK.fbVrR/bpIqNJ5ianF.o./n25XVfn6oAPaUvHe.Csk4zRfsYPi", key: "\xff\xa334\xff\xff\xff\xa3345" },
        { hash: "$2a$05$/OK.fbVrR/bpIqNJ5ianF.ZC1JEJ8Z4gPfpe1JOr/oyPXTWl9EFd.", key: "\xff\xa334\xff\xff\xff\xa3345" },
        { hash: "$2y$05$/OK.fbVrR/bpIqNJ5ianF.nRht2l/HRhr6zmCp9vYUvvsqynflf9e", key: "\xff\xa3345" },
        { hash: "$2a$05$/OK.fbVrR/bpIqNJ5ianF.nRht2l/HRhr6zmCp9vYUvvsqynflf9e", key: "\xff\xa3345" },
        { hash: "$2a$05$/OK.fbVrR/bpIqNJ5ianF.6IflQkJytoRVc1yuaNtHfiuq.FRlSIS", key: "\xa3ab" },
        { hash: "$2x$05$/OK.fbVrR/bpIqNJ5ianF.6IflQkJytoRVc1yuaNtHfiuq.FRlSIS", key: "\xa3ab" },
        { hash: "$2y$05$/OK.fbVrR/bpIqNJ5ianF.6IflQkJytoRVc1yuaNtHfiuq.FRlSIS", key: "\xa3ab" },
        { hash: "$2x$05$6bNw2HLQYeqHYyBfLMsv/OiwqTymGIGzFsA4hOTWebfehXHNprcAS", key: "\xd1\x91" },
        { hash: "$2x$05$6bNw2HLQYeqHYyBfLMsv/O9LIGgn8OMzuDoHfof8AQimSGfcSWxnS", key: "\xd0\xc1\xd2\xcf\xcc\xd8" },
        { hash: "$2a$05$/OK.fbVrR/bpIqNJ5ianF.swQOIzjOiJ9GHEPuhEkvqrUyvWhEMx6", key: "\xaa".repeat(72) + "chars after 72 are ignored as usual" },
        { hash: "$2a$05$/OK.fbVrR/bpIqNJ5ianF.R9xrDjiycxMbQE2bp.vgqlYpW5wx2yy", key: "\xaa\x55".repeat(36) },
        { hash: "$2a$05$/OK.fbVrR/bpIqNJ5ianF.9tQZzcJfm3uj2NvJ/n5xkhpqLrMpWCe", key: "\x55\xaa\xff".repeat(24) },
        { hash: "$2a$05$CCCCCCCCCCCCCCCCCCCCC.7uG0VCzI2bS7j6ymqJi9CdcdxiRTWNy", key: "" }
    ];
    
    var crypt_blowfish_fail_suite = [  // Que des trucs qui doivent échouer : bad number of rounds ou bad algo revision
        // J'imagine que les tests bizarres de crypt_blowfish vérifient en fait l'état des buffers après l'appel. N'a pas lieu d'être en JS.
        { setting: "$2a$03$CCCCCCCCCCCCCCCCCCCCC." },
        { setting: "$2a$32$CCCCCCCCCCCCCCCCCCCCC." },
        { setting: "$2z$05$CCCCCCCCCCCCCCCCCCCCC." },
        { setting: "$2`$05$CCCCCCCCCCCCCCCCCCCCC." },
        { setting: "$2{$05$CCCCCCCCCCCCCCCCCCCCC." }
    ];


    // TODO test parameters (bad number of rounds, invalid salt revision


    it('should pass the jbcrypt test suite', function() {
        jbcrypt_test_suite.forEach(function(test) {
            bCrypt.compareSync(test.pw, test.hash).should.be.true;
        });
    });

    it('should pass the crypt_blowfish test suite', function() {
        crypt_blowfish_test_suite.forEach(function(test) {
            bCrypt.compareSync(test.key, test.hash).should.be.true;
        });
    });

});
