var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

describe('The initial test', function() {
    it('should open the browser', function() {
        return webdriverio
            .remote(options)
            .init()
            .url('http://www.google.com')
            .waitForVisible('#hplogo')
            .getTitle().then(function(title) {
                console.log('Title was: ' + title);
            })
            .end();
    })
})