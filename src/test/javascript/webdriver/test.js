const webdriverio = require('webdriverio');
const assert = require('assert');

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

    it('should have the correct title', function() {
        return client
            .url('http://localhost:8080')
            .getTitle().then(function(title) {
                assert.strictEqual(title, "ACME Security Systems");
            });
    });

    it('should open the sign in window when the signup button', function() {
        return client
            .getText('.nav.nav-tabs li:nth-child(8)').then(function(text) {
                assert.strictEqual(text.trim(), "SIGN IN");
            });
    })

    after(function() {
        return client.end();
    });
});
