(function() {

    var package = gear.Util.readJSON('package.json');
    var licence = '/* Twin-Bcrypt 0.2.0\n' +
     ' * https://github.com/fpirsch/twin-bcrypt\n' +
     ' * Licence: BSD-3-Clause\n */\n';

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
        .run();

}());