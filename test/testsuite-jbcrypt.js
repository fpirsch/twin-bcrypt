/* jshint expr: true */
/* global describe, it, TwinBcrypt */

// This test suite comes from the jBCrypt java project, which has been ported and forked a few times to become twin-bcrypt.
// The original code can be found at https://code.google.com/p/jbcrypt/source/browse/#svn/trunk/src/test/java/org/mindrot/jbcrypt
describe('jBCrypt test suite', function() {
    this.timeout(5000);

    // This test suite can take more than 10s on node and is too slow to be run in a browser.
    it('should hash an empty password', function() {
        TwinBcrypt.compareSync("", "$2a$06$DCq7YPn5Rq63x1Lad4cll.TV4S6ytwfsfvkgY8jIucDrjc8deX1s.").should.be.true;
        TwinBcrypt.compareSync("", "$2a$08$HqWuK6/Ng6sg9gQzbLrgb.Tl.ZHfXLhvt/SgVyWhQqgqcZ7ZuUtye").should.be.true;
        TwinBcrypt.compareSync("", "$2a$10$k1wbIrmNyFAPwPVPSVa/zecw2BCEnBwVS2GbrmgzxFUOqW9dk4TCW").should.be.true;
        TwinBcrypt.compareSync("", "$2a$12$k42ZFHFWqBp3vWli.nIn8uYyIkbvYRvodzbfbK18SSsY.CsIQPlxO").should.be.true;
    });

    it('should hash "a"', function() {
        TwinBcrypt.compareSync("a", "$2a$06$m0CrhHm10qJ3lXRY.5zDGO3rS2KdeeWLuGmsfGlMfOxih58VYVfxe").should.be.true;
        TwinBcrypt.compareSync("a", "$2a$08$cfcvVd2aQ8CMvoMpP2EBfeodLEkkFJ9umNEfPD18.hUF62qqlC/V.").should.be.true;
        TwinBcrypt.compareSync("a", "$2a$10$k87L/MF28Q673VKh8/cPi.SUl7MU/rWuSiIDDFayrKk/1tBsSQu4u").should.be.true;
        TwinBcrypt.compareSync("a", "$2a$12$8NJH3LsPrANStV6XtBakCez0cKHXVxmvxIlcz785vxAIZrihHZpeS").should.be.true;
    });

    it('should hash "abc"', function() {
        TwinBcrypt.compareSync("abc", "$2a$06$If6bvum7DFjUnE9p2uDeDu0YHzrHM6tf.iqN8.yx.jNN1ILEf7h0i").should.be.true;
        TwinBcrypt.compareSync("abc", "$2a$08$Ro0CUfOqk6cXEKf3dyaM7OhSCvnwM9s4wIX9JeLapehKK5YdLxKcm").should.be.true;
        TwinBcrypt.compareSync("abc", "$2a$10$WvvTPHKwdBJ3uk0Z37EMR.hLA2W6N9AEBhEgrAOljy2Ae5MtaSIUi").should.be.true;
        TwinBcrypt.compareSync("abc", "$2a$12$EXRkfkdmXn2gzds2SSitu.MW9.gAVqa9eLS1//RYtYCmB1eLHg.9q").should.be.true;
    });

    it('should hash "abcdefghijklmnopqrstuvwxyz"', function() {
        TwinBcrypt.compareSync("abcdefghijklmnopqrstuvwxyz", "$2a$06$.rCVZVOThsIa97pEDOxvGuRRgzG64bvtJ0938xuqzv18d3ZpQhstC").should.be.true;
        TwinBcrypt.compareSync("abcdefghijklmnopqrstuvwxyz", "$2a$08$aTsUwsyowQuzRrDqFflhgekJ8d9/7Z3GV3UcgvzQW3J5zMyrTvlz.").should.be.true;
        TwinBcrypt.compareSync("abcdefghijklmnopqrstuvwxyz", "$2a$10$fVH8e28OQRj9tqiDXs1e1uxpsjN0c7II7YPKXua2NAKYvM6iQk7dq").should.be.true;
        TwinBcrypt.compareSync("abcdefghijklmnopqrstuvwxyz", "$2a$12$D4G5f18o7aMMfwasBL7GpuQWuP3pkrZrOAnqP.bmezbMng.QwJ/pG").should.be.true;
    });

    it('should hash ""~!@#$%^&*()      ~!@#$%^&*()PNBFRD"', function() {
        TwinBcrypt.compareSync("~!@#$%^&*()      ~!@#$%^&*()PNBFRD", "$2a$06$fPIsBO8qRqkjj273rfaOI.HtSV9jLDpTbZn782DC6/t7qT67P6FfO").should.be.true;
        TwinBcrypt.compareSync("~!@#$%^&*()      ~!@#$%^&*()PNBFRD", "$2a$08$Eq2r4G/76Wv39MzSX262huzPz612MZiYHVUJe/OcOql2jo4.9UxTW").should.be.true;
        TwinBcrypt.compareSync("~!@#$%^&*()      ~!@#$%^&*()PNBFRD", "$2a$10$LgfYWkbzEvQ4JakH7rOvHe0y8pHKF9OaFgwUZ2q7W2FFZmZzJYlfS").should.be.true;
        TwinBcrypt.compareSync("~!@#$%^&*()      ~!@#$%^&*()PNBFRD", "$2a$12$WApznUOJfkEGSmYRfnkrPOr466oFDCaj4b6HY3EXGvfxm43seyhgC").should.be.true;
    });

});
