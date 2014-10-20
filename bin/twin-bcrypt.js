#!/usr/bin/env node
var TwinBcrypt = require("../twin-bcrypt.min.js"),
    showProgress = !!process.stdout.clearLine,
    barlen = 51,
    complete = Array(barlen+1).join('■');

if (process.argv.length !== 4) {
    console.error("twin-bcrypt v" + TwinBcrypt.version);
    console.error("\x1B[90mUsage:\x1B[39m twin-bcrypt \x1B[90m<cost> <password-to-hash>\x1B[39m");
    process.exit();
}

var cost = parseInt(process.argv[2]);
if (isNaN(cost) || cost < 4 || cost > 31) {
    console.error('The cost parameter must be an integer between 4 and 31 inclusive.');
    process.exit(1);
}

var password = process.argv[3];

if (showProgress) {
    process.stdout.write('\x1B[90m[' + Array(barlen+1).join('─') + ']\x1B[39m');
}

TwinBcrypt.hash(password, cost,
    function(p) {
        if (showProgress) {
            process.stdout.cursorTo(1);
            process.stdout.write('\x1B[32m' + complete.substr(0, Math.round(p*barlen)) + '\x1B[39m');
            process.stdout.cursorTo((barlen-3)/2);
            process.stdout.write(' '+Math.round(p*99)+'% ');
        }
    },
    function(hash) {
        if (showProgress) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }
        console.log(hash);
    }
);