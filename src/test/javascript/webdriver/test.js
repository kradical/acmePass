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

describe.only('Creating ACMEPass passwords', function () {
    before(client.setup);

    const newAcmePassButton = 'button.btn.btn-primary';
    const saveAcmePassButton = '.modal-footer .btn-primary';
    const cancelButton = '.btn-default';

    it('it creates an ACMEPass', function () {
        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'testname')
            .setValue('#field_login', 'testlogin')
            .setValue('#field_password', 'testpassword')
            .click(saveAcmePassButton)
    })

    it('it cancels the creation of an ACMEPass', function () {
        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'testname')
            .setValue('#field_login', 'testlogin')
            .setValue('#field_password', 'testpassword')
            .click(cancelButton)
    })

    it('it has a disabled Save button when the site field is invalid', function () {
        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'sm')
            .setValue('#field_login', 'testlogin')
            .setValue('#field_password', 'testpassword')
            .isEnabled(saveAcmePassButton).then(function(isEnabled) {
                assert.equal(isEnabled, false, 'Save button should be disabled');
            })
            .click(cancelButton)
    })

    it('it has a disabled Save button when the site field is empty', function () {
        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', '')
            .setValue('#field_login', 's')
            .setValue('#field_password', 'testpassword')
            .isEnabled(saveAcmePassButton).then(function(isEnabled2) {
                assert.equal(isEnabled2, false, 'Save button  be disabled');
            })
            .click(cancelButton)
    })

    it('it has a disabled Save button when the login field is empty', function () {
        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'testname')
            .setValue('#field_login', '')
            .setValue('#field_password', 'testpassword')
            .isEnabled(saveAcmePassButton).then(function(isEnabled) {
                assert.equal(isEnabled, false, 'Save button should be disabled');
            })
            .click(cancelButton)
    })

    it('it has a disabled Save button when the password field is empty', function () {
        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'testname')
            .setValue('#field_login', 'testlogin')
            .setValue('#field_password', '')
            .isEnabled(saveAcmePassButton).then(function(isEnabled) {
                assert.equal(isEnabled, false, 'Save button should be disabled');
            })
            .click(cancelButton)
    })

    after(client.end);
});

/**
 * Tests that all fields of a password are editable
 */
describe.only('Editing ACMEPass passwords', function () {
    const mainButton = 'button.btn.btn-primary';
    const savePass = `div.modal-footer ${mainButton}`;
    const firstRow = 'tr:first-child';

    /**
     * Setup the page to be editting a brand new acmePass
     */
    before(function () {
        const createPass = mainButton
        const sortCreated = 'th[jh-sort-by="createdDate"]';

        return client
            .setup()
            .click(createPass)
            .waitForVisible('#field_site')
            .setValue('#field_site', 'testsite')
            .setValue('#field_login', 'testlogin')
            .setValue('#field_password', 'testpassword')
            .click(savePass)
            .waitForVisible(sortCreated)
            .click(sortCreated)
            .click(sortCreated)
    });

    beforeEach(function () {
        const editIcon = 'button.btn.btn-info.btn-sm';
        const firstRowEdit = `${firstRow} ${editIcon}`;

        return client
            .waitForVisible(firstRowEdit)
            .click(firstRowEdit);
    })

    it('edits the site field', function () {
        const siteCell = 'td:nth-child(2)';
        const firstRowSite = `${firstRow} ${siteCell}`;

        return client
            .waitForVisible('#field_site')
            .setValue('#field_site', 'testsiteEDIT')
            .click(savePass)
            .waitForVisible(firstRowSite)
            .getText(firstRowSite).then(function (text) {
                assert.strictEqual(text, 'testsiteEDIT', `site fields not equal '${text}' !== 'testsiteEDIT'`);
            });
    });

    it('edits the login field', function () {
        const loginCell = 'td:nth-child(3)';
        const firstRowLogin = `${firstRow} ${loginCell}`;

        return client
            .waitForVisible('#field_login')
            .setValue('#field_login', 'testloginEDIT')
            .click(savePass)
            .waitForVisible(firstRowLogin)
            .getText(firstRowLogin).then(function (text) {
                assert.strictEqual(text, 'testloginEDIT', `login fields not equal '${text}' !== 'testloginEDIT'`);
            });
    });

    it('edits the password field', function () {
        const passwordCell = 'td:nth-child(4) input.acmepass-password';
        const firstRowPassword = `${firstRow} ${passwordCell}`;

        return client
            .waitForVisible('#field_password')
            .setValue('#field_password', 'testpasswordEDIT')
            .click(savePass)
            .waitForVisible(firstRowPassword)
            .getValue(firstRowPassword).then(function (text) {
                assert.strictEqual(text, 'testpasswordEDIT', `password fields not equal '${text}' !== 'testpasswordEDIT'`);
            });
    });

    it('cancels changes', function () {
        const siteCell = 'td:nth-child(2)';
        const firstRowSite = `${firstRow} ${siteCell}`;
        const cancelPass = 'div.modal-footer button.btn.btn-default';

        return client
            .waitForVisible('#field_site')
            .setValue('#field_site', 'testsiteEDIT2OMG')
            .click(cancelPass)
            .waitForVisible(firstRowSite)
            .getText(firstRowSite).then(function (text) {
                assert.strictEqual(text, 'testsiteEDIT', `site fields not equal '${text}' !== 'testsiteEDIT'`);
            });
    });

    it('does not allow saving an unedited pass', function () {
        return client
            .waitForVisible(savePass)
            .getAttribute(savePass, "disabled").then(function (text) {
                assert.strictEqual(text, 'true', `save button should be disabled, '${text}' !== 'true'`);
            });
    });

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
 * Tests that password generation works as expected
 */
describe.only('Generating ACMEPass passwords', function () {
    before(client.setup);

    before(function () {

        const newAcmePassButton = 'button.btn.btn-primary';
        const generateButton1 = 'button.btn.btn-primary';

        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'testsite')
            .setValue('#field_login', 'testlogin')
            .click(generateButton1)
    })

    // tests default settings (lowercase, uppercase, digits, special characteres, length 8)
    it('tests default settings', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';

        return client
            .waitForVisible(generateButton2, 5000)
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - default settings')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^[A-Za-z0-9!@#$%_-]{8}$/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests lowercase characters and length 8
    it('tests lowercase characters', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const upperCase = '#field_upper';
        const digits = '#field_digits';
        const special = '#field_special';

        return client
            .waitForVisible(upperCase, 5000)
            .click(upperCase)
            .click(digits)
            .click(special)
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - lowercase')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^[a-z]{8}$/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests uppercase characters and length 8
    it('tests uppercase characters', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const lowerCase = '#field_lower';
        const digits = '#field_digits';
        const special = '#field_special';

        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(digits)
            .click(special)
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - uppercase')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^[A-Z]{8}$/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests digits and length 8
    it('tests digits', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const lowerCase = '#field_lower';
        const upperCase = '#field_upper';
        const special = '#field_special';

        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(upperCase)
            .click(special)
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - digits')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^[0-9]{8}$/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests special characters and length 8
    it('tests special characters', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const lowerCase = '#field_lower';
        const upperCase = '#field_upper';
        const digits = '#field_digits';

        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(upperCase)
            .click(digits)

            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - special characters')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^[!@#$%_-]{8}$/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests prevent repeated characters using digits and length 10
    it('tests prevent repeated characters', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const lowerCase = '#field_lower';
        const upperCase = '#field_upper';
        const special = '#field_special';
        const repeated = '#field_repetition';

        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(upperCase)
            .click(special)
            .click(repeated)
            .setValue('#field_length', '10')
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - prevent repeated characters')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^(?:([0-9])(?!.*\1)){10}$/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests all parameters and length 69 (maximum possitble length given no repeated characters)
    it('tests all parameters', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const repeated = '#field_repetition';

        return client
            .waitForVisible(repeated, 5000)
            .click(repeated)
            .setValue('#field_length', '69')
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - all parameters')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^(?:([a-zA-Z0-9!@#$%_-])(?!.*\1)){69}$/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests no parameters and length 8
    it('tests no parameters', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const lowerCase = '#field_lower';
        const upperCase = '#field_upper';
        const digits = '#field_digits';
        const special = '#field_special';

        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(upperCase)
            .click(digits)
            .click(special)
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - no parameters')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^(?![\s\S])/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests length 0 and default parameters
    it('tests length 0', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const lowerCase = '#field_lower';

        return client
            .waitForVisible(lowerCase, 5000)
            .setValue('#field_length', '0')
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - length 0')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^(?![\s\S])/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    // tests length 2048 and default parameters
    it('tests length 2048', function () {

        const generateButton1 = 'button.btn.btn-primary';
        const generateButton2 = 'button.btn.btn-primary';
        const cancelButton = 'button.btn.btn-default';
        const lowerCase = '#field_lower';

        return client
            .waitForVisible(lowerCase, 5000)
            .setValue('#field_length', '2048')
            .click(generateButton2)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                console.log('Printing from function: Generating ACMEPass passwords - length 2048')
                console.log('Password generated was: ' + trimmed)
                chai.expect(trimmed).to.match(/^[A-Za-z0-9!@#$%_-]{2048}$/)
            })
            .click(cancelButton)
            .click(generateButton1)
    })

    after(client.end);
});
