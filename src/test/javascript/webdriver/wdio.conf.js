exports.config = {
    mochaOpts: {
        timeout: 99999
    },
    specs: [
        'src/test/javascript/webdriver/**'
    ],
    reporters: ['spec']
}