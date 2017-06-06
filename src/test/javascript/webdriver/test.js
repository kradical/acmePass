const webdriverio = require('webdriverio');
const assert = require('assert');

const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
}

let client = webdriverio.remote(options);
client.setup = function() {
    return client.init()
        .url('http://localhost:8080')
        .waitForExist('body')
        .isExisting('#login').then(function(isExisting) {
            // need to login
            if(isExisting) {
                const acmePassTab = 'a[href="#/acme-pass"]';
                const submitButton = 'button.btn.btn-primary';

                return client
                    .click('#login')
                    .waitForExist('#username')
                    .setValue('#username', 'admin@acme.com')
                    .setValue('#password', 'K-10ficile')
                    .click(submitButton)
                    .waitForExist(acmePassTab)
                    .click(acmePassTab);
            }
        });
}

describe.only('Listing ACMEPass passwords', function() {
    before(client.setup);

    it('has a stub', function() {
        return client
    })

    after(client.end);
});

describe('Hiding/showing ACMEPass passwords', function() {
    before(client.setup);

    it('has a stub', function() {
        return client
    })

    after(client.end);
});

describe('Adding ACMEPass passwords', function() {
    before(client.setup);

    it('has a stub', function() {
        return client
    })

    after(client.end);
});

describe('Editing ACMEPass passwords', function() {
    before(client.setup);

    it('has a stub', function() {
        return client
    })

    after(client.end);
});

describe('Deleting ACMEPass passwords', function() {
    before(client.setup);

    it('has a stub', function() {
        return client
    })

    after(client.end);
});
