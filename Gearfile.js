new gear.Queue({ registry: 'gear-lib' })
    .read('src/twin-bcrypt.js')
    .jshint()
    .readBefore('node_modules/setimmediate/setImmediate.js')
    .concat()
    .jsminify()
    .write('twin-bcrypt.min.js')
    .log('twin-bcrypt.min.js written.')
    .run();