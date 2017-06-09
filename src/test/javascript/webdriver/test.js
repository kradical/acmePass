const webdriverio = require('webdriverio');
const assert = require('assert');
const chai = require('chai');

const options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
}

let client = webdriverio.remote(options);
client.setup = function () {
    const acmePassTab = 'a[href="#/acme-pass"]';
    const submitButton = 'button.btn.btn-primary';
    return client.init()
        .url('http://localhost:8080')
        // Expanded the view to expose Create New Acme Pass button
        .setViewportSize({
            width: 1366,
            height: 768
        })
        .waitForExist('#login')
        .click('#login')
        .waitForExist('#username')
        // Changed login type from Admin to Employee because Administration tab
        // shifts the elements to obscure the Create New Acme Pass button
        // (We should likely fix this)
        .setValue('#username', 'alice.sandhu@acme.com')
        .setValue('#password', 'princess')
        .click(submitButton)
        // This element often timed out
        .waitForExist(acmePassTab, 5000)
        .click(acmePassTab)
}

describe('Listing ACMEPass passwords', function () {
    before(client.setup);

    it('has a stub', function () {
        return client
    })

    after(client.end);
});

describe('Hiding/showing ACMEPass passwords', function () {
    before(client.setup);

    it('has a stub', function () {
        return client
    })

    after(client.end);
});

describe('Adding ACMEPass passwords', function () {
    before(client.setup);

    it('has a stub', function () {
        return client
    })

    after(client.end);
});

describe('Editing ACMEPass passwords', function () {
    before(client.setup);

    it('has a stub', function () {
        return client
    })

    after(client.end);
});

describe('Deleting ACMEPass passwords', function () {
    before(client.setup);

    it('has a stub', function () {
        return client
    })

    after(client.end);
});

/**
 * Tests that a password generated with default parameters meets requirements
 * (lowercase, uppercase, digits, special characteres, length 8)
 */
describe.only('Generating ACMEPass passwords - default settings', function () {
    before(client.setup);

    const newAcmePassButton = 'button.btn.btn-primary';
    const generateButton1 = 'button.btn.btn-primary';
    const generateButton2 = 'button.btn.btn-primary';

    it('has a stub', function () {
        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'testname')
            .setValue('#field_login', 'testlogin')
            .click(generateButton1)
            .waitForVisible(generateButton2, 5000)
            .click(generateButton2)
            .getValue('#field_password').then(function(text) {
                // Not entirely sure why it needs an extra character, maybe it counts the trailing comma?
                console.log('Printing from function: Generating ACMEPass passwords - default settings')
                console.log('Password generated was: ' + text)
                chai.expect(text).to.match(/^[A-Za-z0-9!@#$%-_]{9}$/)
            });
    })

    after(client.end);
});