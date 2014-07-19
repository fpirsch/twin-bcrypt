(function() {

    var package = gear.Util.readJSON('package.json');
    var licence = '/* Twin-Bcrypt ' + package.version + '\n' +
     ' * https://github.com/fpirsch/twin-bcrypt\n' +
     ' * Licence: BSD-3-Clause\n */\n';


    // Until UglifyJS can minify asm.js properly, we need to do it ourselves.
    // Extract and minify asm.js code.
    var fs = require('fs');
    var code = fs.readFileSync('src/twin-bcrypt.js')+'';
    var asmStart = code.indexOf('/* @preserve BEGIN ASM */');
    var asmEnd = code.indexOf('/* @preserve END ASM */');
    var asm = code.substring(asmStart, asmEnd+23);
    asm = asm
        .replace(/\/\/.*/g, '')              // remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')    // remove multi-line comments
        .replace(/\n\s*/g, '')               // remove indentation
        .replace(/ ([+=^|&]|>+|<+) /g, '$1') // remove spaces around operators
        .replace(/[\r\n/]/g, '');            // remove new lines



    new gear.Queue()
        .read('bower.json')
        .replace({ regex: /"version": ".*",/, replace: '"version": "'+package.version+'",' })
        .write('bower.json')
        .log('bower.json updated')
        .run();



    new gear.Queue({ registry: 'gear-lib' })
        .read('src/twin-bcrypt.js')
        .replace({ regex: /{{ version }}/, replace: package.version })
        .jshint()
        .readBefore('node_modules/setimmediate/setImmediate.js')
        .concat()
        .jsminify()
        .stamp({ prefix: licence })
        .write('twin-bcrypt.min.js')
        .log('twin-bcrypt.min.js written.')
        .run(function(err, result) {
            // Reinject minified asm.js code.
            if (err) return;
            var minified = result.toString();
            var asmModule = minified.match(/function (\w+)\(\w+,\w+,\w+\)\{"use asm";/);
            if (!asmModule) {
                console.log("No asm.js module found");
                return;
            }
            var asmModuleName = asmModule[1];
            asm = asm.replace('bcryptModule', asmModuleName);
            minified = minified.replace(/\/\* @preserve BEGIN ASM \*\/[\s\S]*?\/\* @preserve END ASM \*\//, asm);
            fs.writeFileSync('twin-bcrypt.min.js', minified);
            console.log('twin-bcrypt.min.js asm.js corrected.');
        });

}());