const webdriverio = require('webdriverio');

const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
}

let client;

describe('The initial test', function() {
    before(function(){
        client = webdriverio.remote(options);
        return client.init();
    });

    it('should open the browser', function() {
        return client
            .url('http://www.google.com')
            .getTitle().then(function(title) {
                console.log('Title was: ' + title);
            });
    });

    it('should open the browser', function() {
        return client
            .url('http://www.facebook.com')
            .getTitle().then(function(title) {
                console.log('Title was: ' + title);
            });
    });

    after(function() {
        return client.end();
    });
});
