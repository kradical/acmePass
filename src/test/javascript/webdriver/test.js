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

describe.only('Listing ACMEPass passwords', function () {
    before(client.setup);

    //Sorting Selectors
    const sortByID = 'body > div:nth-child(3) > div > div > div.table-responsive > table > thead > tr > th:nth-child(1)'
    const sortBySite = 'body > div:nth-child(3) > div > div > div.table-responsive > table > thead > tr > th:nth-child(2)'
    const sortByLogin = 'body > div:nth-child(3) > div > div > div.table-responsive > table > thead > tr > th:nth-child(3)'
    const sortByPassword = 'body > div:nth-child(3) > div > div > div.table-responsive > table > thead > tr > th:nth-child(4)'
    const sortByCreatedDate = 'body > div:nth-child(3) > div > div > div.table-responsive > table > thead > tr > th:nth-child(5)'
    const sortByLastModifiedDate = 'body > div:nth-child(3) > div > div > div.table-responsive > table > thead > tr > th:nth-child(6)'

    // Sorting Symbols Selectors
    const sortAZ = 'span.glyphicon.glyphicon-sort-by-attributes'
    const sortZA = 'span.glyphicon.glyphicon-sort-by-attributes-alt'

    //Creating ACMEPass
    const newAcmePassButton = 'body > div:nth-child(3) > div > div > div.container-fluid > div > div > button';
    const saveAcmePassButton = 'body > div.modal.fade.ng-isolate-scope.in > div > div > form > div.modal-footer > button.btn.btn-primary';

    //3rd row selector
    const firstRow = 'body > div:nth-child(3) > div > div > div.table-responsive > table > tbody > tr:nth-child(1)'
    const secondRow = 'body > div:nth-child(3) > div > div > div.table-responsive > table > tbody > tr:nth-child(2)'
    const thirdRow = 'body > div:nth-child(3) > div > div > div.table-responsive > table > tbody > tr:nth-child(3)'

    //Table row cell selectors
    const idCell = 'td:nth-child(1)';
    const siteCell = 'td:nth-child(2)';
    const loginCell = 'td:nth-child(3)';
    const passwordCell = 'td:nth-child(4) > div > input';
    const createdDateCell = 'td:nth-child(5)';
    const modifiedDateCell = 'td:nth-child(6)';

    //util selectors
    const dialog = 'body > div.modal.fade.ng-isolate-scope.in > div > div > form'
    const passwordToggle = 'td:nth-child(4) > div > span'

    var firstValue
    var secondValue
    var thirdValue

    it('it creates an ACMEPass', function () {
        return client
            .waitForExist(newAcmePassButton, 5000)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'atestname')
            .setValue('#field_login', 'ctestlogin')
            .setValue('#field_password', 'btestpassword')
            .click(saveAcmePassButton)
            .waitForExist(dialog, true)
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'ctestname')
            .setValue('#field_login', 'btestlogin')
            .setValue('#field_password', 'atestpassword')
            .click(saveAcmePassButton)
            .waitForExist(dialog, true)
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'btestname')
            .setValue('#field_login', 'atestlogin')
            .setValue('#field_password', 'ctestpassword')
            .click(saveAcmePassButton)
            .waitForExist(dialog, 2000, true)
            .isExisting(thirdRow).then(function(bool) {
                assert(bool, "Failed to create 3 ACMEPasses")
            })
    })

    ////////////////////////////////////////////////////////////////////////////
    //Sort by ID
    ////////////////////////////////////////////////////////////////////////////
    it('it sorts list by ID (Z-A)', function () {
        return client
            .waitForExist(sortByID, 5000)
            .click(sortByID)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + idCell).then(function(text) {
                firstValue = text
            })
            .getText(secondRow + ' > ' + idCell).then(function(text) {
                secondValue = text
            })
            .getText(thirdRow + ' > ' + idCell).then(function(text) {
                thirdValue = text
            })
            .isExisting(sortByID + ' > ' + sortZA).then( function () {
                assert(firstValue > secondValue && secondValue > thirdValue, 'Failed to sort list (Z-A) by ID correctly');
            })
    })

    it('it sorts list by ID (A-Z)', function () {
        return client
            .waitForExist(sortByID, 5000)
            .click(sortByID)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + idCell).then(function(text) {
                firstValue = text
            })
            .getText(secondRow + ' > ' + idCell).then(function(text) {
                secondValue = text
            })
            .getText(thirdRow + ' > ' + idCell).then(function(text) {
                thirdValue = text
            })
            .isExisting(sortByID + ' > ' + sortAZ).then( function () {
                assert(firstValue < secondValue && secondValue < thirdValue, 'Failed to sort list by (A-Z) ID correctly');
            })
    })

    ////////////////////////////////////////////////////////////////////////////
    //Sort by Site
    ////////////////////////////////////////////////////////////////////////////
    it('it sorts list by Site (A-Z)', function () {
        return client
            .waitForExist(sortBySite, 5000)
            .click(sortBySite)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + siteCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .getText(secondRow + ' > ' + siteCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .getText(thirdRow + ' > ' + siteCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .isExisting(sortBySite + ' > ' + sortAZ).then( function () {
                assert(firstValue <= secondValue && secondValue <= thirdValue, 'Failed to sort list by (A-Z) Site correctly');
            })
    })

    it('it sorts list by Site (Z-A)', function () {
        return client
            .waitForExist(sortBySite, 5000)
            .click(sortBySite)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + siteCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .getText(secondRow + ' > ' + siteCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .getText(thirdRow + ' > ' + siteCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .isExisting(sortBySite + ' > ' + sortZA).then( function () {
                assert(firstValue >= secondValue && secondValue >= thirdValue, 'Failed to sort list (Z-A) by Site correctly');
            })
    })

    ////////////////////////////////////////////////////////////////////////////
    //Sort by Login
    ////////////////////////////////////////////////////////////////////////////
    it('it sorts list by Login (A-Z)', function () {
        return client
            .waitForExist(sortByLogin, 5000)
            .click(sortByLogin)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + loginCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .getText(secondRow + ' > ' + loginCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .getText(thirdRow + ' > ' + loginCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .isExisting(sortByLogin + ' > ' + sortAZ).then( function () {
                assert(firstValue <= secondValue && secondValue <= thirdValue, 'Failed to sort list by (A-Z) Login correctly');
            })
    })

    it('it sorts list by Login (Z-A)', function () {
        return client
            .waitForExist(sortByLogin, 5000)
            .click(sortByLogin)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + loginCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .getText(secondRow + ' > ' + loginCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .getText(thirdRow + ' > ' + loginCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .isExisting(sortByLogin + ' > ' + sortZA).then( function () {
                assert(firstValue >= secondValue && secondValue >= thirdValue, 'Failed to sort list (Z-A) by Login correctly');
            })
    })

    ////////////////////////////////////////////////////////////////////////////
    //Sort by Password
    ////////////////////////////////////////////////////////////////////////////
    it('it sorts list by Password (A-Z)', function () {
        return client
            .waitForExist(sortByPassword, 5000)
            .click(sortByPassword)
            .waitForExist(thirdRow)
            .waitForExist(firstRow + ' > ' + passwordToggle)
            .click(firstRow + ' > ' + passwordToggle)
            .getValue(firstRow + ' > ' + passwordCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .waitForExist(firstRow + ' > ' + passwordToggle)
            .click(firstRow + ' > ' + passwordToggle)
            .waitForExist(secondRow + ' > ' + passwordToggle)
            .click(secondRow + ' > ' + passwordToggle)
            .getValue(secondRow + ' > ' + passwordCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .waitForExist(secondRow + ' > ' + passwordToggle)
            .click(secondRow + ' > ' + passwordToggle)
            .waitForExist(thirdRow + ' > ' + passwordToggle)
            .click(thirdRow + ' > ' + passwordToggle)
            .getValue(thirdRow + ' > ' + passwordCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .waitForExist(thirdRow + ' > ' + passwordToggle)
            .click(thirdRow + ' > ' + passwordToggle)
            .isExisting(sortByPassword + ' > ' + sortAZ).then( function () {
                assert(firstValue <= secondValue && secondValue <= thirdValue, 'Failed to sort list by (A-Z) Password correctly');
            })
    })

    it('it sorts list by Password (Z-A)', function () {
        return client
            .waitForExist(sortByPassword, 5000)
            .click(sortByPassword)
            .waitForExist(thirdRow)
            .waitForExist(firstRow + ' > ' + passwordToggle)
            .click(firstRow + ' > ' + passwordToggle)
            .getValue(firstRow + ' > ' + passwordCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .waitForExist(firstRow + ' > ' + passwordToggle)
            .click(firstRow + ' > ' + passwordToggle)
            .waitForExist(secondRow + ' > ' + passwordToggle)
            .click(secondRow + ' > ' + passwordToggle)
            .getValue(secondRow + ' > ' + passwordCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .waitForExist(secondRow + ' > ' + passwordToggle)
            .click(secondRow + ' > ' + passwordToggle)
            .waitForExist(thirdRow + ' > ' + passwordToggle)
            .click(thirdRow + ' > ' + passwordToggle)
            .getValue(thirdRow + ' > ' + passwordCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .waitForExist(thirdRow + ' > ' + passwordToggle)
            .click(thirdRow + ' > ' + passwordToggle)
            .isExisting(sortByPassword + ' > ' + sortZA).then( function () {
                assert(firstValue >= secondValue && secondValue >= thirdValue, 'Failed to sort list (Z-A) by Password correctly');
            })
    })

    ////////////////////////////////////////////////////////////////////////////
    //Sort by Created Date
    ////////////////////////////////////////////////////////////////////////////
    it('it sorts list by Created Date (A-Z)', function () {
        return client
            .waitForExist(sortByCreatedDate, 5000)
            .click(sortByCreatedDate)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + createdDateCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .getText(secondRow + ' > ' + createdDateCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .getText(thirdRow + ' > ' + createdDateCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .isExisting(sortByCreatedDate + ' > ' + sortAZ).then( function () {
                assert(firstValue <= secondValue && secondValue <= thirdValue, 'Failed to sort list by (A-Z) Created Date correctly');
            })
    })

    it('it sorts list by Created Date (Z-A)', function () {
        return client
            .waitForExist(sortByCreatedDate, 5000)
            .click(sortByCreatedDate)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + createdDateCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .getText(secondRow + ' > ' + createdDateCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .getText(thirdRow + ' > ' + createdDateCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .isExisting(sortByCreatedDate + ' > ' + sortZA).then( function () {
                assert(firstValue >= secondValue && secondValue >= thirdValue, 'Failed to sort list (Z-A) by Created Date correctly');
            })
    })

    ////////////////////////////////////////////////////////////////////////////
    //Sort by Last Modified Date
    ////////////////////////////////////////////////////////////////////////////
    it('it sorts list by Last Modified Date (A-Z)', function () {
        return client
            .waitForExist(sortByLastModifiedDate, 5000)
            .click(sortByLastModifiedDate)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + modifiedDateCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .getText(secondRow + ' > ' + modifiedDateCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .getText(thirdRow + ' > ' + modifiedDateCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .isExisting(sortByLastModifiedDate + ' > ' + sortAZ).then( function () {
                assert(firstValue <= secondValue && secondValue <= thirdValue, 'Failed to sort list by (A-Z) Last Modified Date correctly');
            })
    })

    it('it sorts list by Last Modified Date (Z-A)', function () {
        return client
            .waitForExist(sortByLastModifiedDate, 5000)
            .click(sortByLastModifiedDate)
            .waitForExist(thirdRow)
            .getText(firstRow + ' > ' + modifiedDateCell).then(function(text) {
                firstValue = text.toLowerCase()
            })
            .getText(secondRow + ' > ' + modifiedDateCell).then(function(text) {
                secondValue = text.toLowerCase()
            })
            .getText(thirdRow + ' > ' + modifiedDateCell).then(function(text) {
                thirdValue = text.toLowerCase()
            })
            .isExisting(sortByLastModifiedDate + ' > ' + sortZA).then( function () {
                assert(firstValue >= secondValue && secondValue >= thirdValue, 'Failed to sort list (Z-A) by Last Moditied Date correctly');
            })
    })

    after(client.end);
});

describe('Hiding/Showing ACMEPass passwords', function () {
    before(client.setup);

    const newAcmePassButton = 'button.btn.btn-primary';
    const saveAcmePassButton = '.modal-footer .btn-primary';
    const passwordtoggle = 'body > div:nth-child(3) > div > div > div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > span'
    const inputfield = 'body > div:nth-child(3) > div > div > div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > input'

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

    it('it shows ACMEPass passwords', function () {
        return client
            .waitForVisible(passwordtoggle)
            .click(passwordtoggle)
            .getAttribute(inputfield, 'type').then(function (text) {
                assert.strictEqual(text, 'text', 'The password is not visible');
            });
    })

    it('it hides ACMEPass passwords', function () {
        return client
            .waitForVisible(passwordtoggle)
            .click(passwordtoggle)
            .getAttribute(inputfield, 'type').then(function (text) {
                assert.strictEqual(text, 'password', 'The password is still visible');
            });
    })

    after(client.end);
});

describe.only('Creating ACMEPass passwords', function () {
    before(client.setup);

    const newAcmePassButton = 'button.btn.btn-primary';
    const saveAcmePassButton = '.modal-footer .btn-primary';
    const cancelButton = '.btn-default';

    it('it creates an ACMEPass', function () {
        const firstRow = 'tr:first-child';
        const siteCell = 'td:nth-child(2)';
        const loginCell = 'td:nth-child(3)';
        const passwordCell = 'td:nth-child(4) input.acmepass-password';
        const firstRowSite = `${firstRow} ${siteCell}`;
        const firstRowLogin = `${firstRow} ${loginCell}`;
        const firstRowPassword = `${firstRow} ${passwordCell}`;

        return client
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'testname')
            .setValue('#field_login', 'testlogin')
            .setValue('#field_password', 'testpassword')
            .click(saveAcmePassButton)
            .waitForVisible(firstRowSite)
            .getText(firstRowSite).then(function (nametext) {
                assert.strictEqual(nametext, 'testname', `site fields not equal '${nametext}' !== 'testname'`);
            })
            .waitForVisible(firstRowLogin)
            .getText(firstRowLogin).then(function (logintext) {
                assert.strictEqual(logintext, 'testlogin', `site fields not equal '${logintext}' !== 'testlogin'`);
            })
            .waitForVisible(firstRowPassword)
            .getValue(firstRowPassword).then(function (passwordtext) {
                assert.strictEqual(passwordtext, 'testpassword', `site fields not equal '${passwordtext}' !== 'testpassword'`);
            });
    })

    it('it cancels the creation of an ACMEPass', function () {
        return client
            .waitForExist(newAcmePassButton, 5000)
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
            .isEnabled(saveAcmePassButton).then(function (isEnabled) {
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
            .isEnabled(saveAcmePassButton).then(function (isEnabled2) {
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
            .isEnabled(saveAcmePassButton).then(function (isEnabled) {
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
            .isEnabled(saveAcmePassButton).then(function (isEnabled) {
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

/**
 * Tests that password deletion works as expected
 */
describe.only('Deleting ACMEPass passwords', function () {
    before(client.setup);

    const firstRow = 'tr:first-child'
    const idCell = 'td:nth-child(1)'
    const firstRowId = `${firstRow} ${idCell}`
    const newAcmePassButton = 'button.btn.btn-primary'
    const saveAcmePassButton = '.modal-footer .btn-primary'
    const deleteIcon = 'button.btn.btn-danger.btn-sm'
    const deleteButton = 'button.btn.btn-danger'
    const firstRowDelete = `${firstRow} ${deleteIcon}`
    const sortCreated = 'th[jh-sort-by="createdDate"]'

    it('it creates two ACMEPasses and deletes the most recent one', function () {
        var id1
        return client
            // create first ACME Pass
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site', 5000)
            .setValue('#field_site', 'testsite1')
            .setValue('#field_login', 'testlogin1')
            .setValue('#field_password', 'testpassword1')
            .click(saveAcmePassButton)
            // create second ACME Pass
            .waitForExist(newAcmePassButton)
            .click(newAcmePassButton)
            .waitForExist('#field_site', 5000)
            .setValue('#field_site', 'testsite2')
            .setValue('#field_login', 'testlogin2')
            .setValue('#field_password', 'testpassword2')
            .click(saveAcmePassButton)
            .waitForExist(sortCreated, 5000)
            .click(sortCreated)
            .click(sortCreated)
            .getText(firstRowId).then(function (text) {
                id1 = text
            })
            // delete the most recent (second) ACME Pass
            .click(firstRowDelete)
            .waitForExist(deleteButton)
            .click(deleteButton)
            // wait before reading the value of first row ID
            .pause(500)
            // ensure the correct ACME Pass has been deleted
            .getText(firstRowId).then(function (text) {
                assert.notStrictEqual(id1, text, `ID of deleted pass should not equal ID of most recent pass '${id1}' !== '${text}'`);
            });
    })

    after(client.end);
});

/**
 * Tests that password generation works as expected
 */
describe.only('Generating ACMEPass passwords', function () {
    before(client.setup);

    const generateForm = 'form[name="pdwGenForm"]';
    const generateButton = `${generateForm} div.modal-body div.clearfix button`;
    const mainButton = 'button.btn.btn-primary';
    const cancelButton = 'button.btn.btn-default';
    const lowerCase = `${generateForm} div.form-group:nth-child(2)`;
    const upperCase = `${generateForm} div.form-group:nth-child(3)`;
    const digits = `${generateForm} div.form-group:nth-child(4) label`;
    const special = `${generateForm} div.form-group:nth-child(5)`;
    const repeated = `${generateForm} div.form-group:nth-child(6)`;

    before(function () {
        return client
            .waitForExist(mainButton)
            .click(mainButton)
            .waitForExist('#field_site')
            .setValue('#field_site', 'testsite')
            .setValue('#field_login', 'testlogin')
            .click(mainButton);
    });

    // tests default settings (lowercase, uppercase, digits, special characteres, length 8)
    it('tests default settings', function () {
        return client
            .waitForVisible(generateButton, 5000)
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                chai.expect(trimmed).to.match(/^[A-Za-z0-9!@#$%_-]{8}$/)
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests lowercase characters and length 8
    it('tests lowercase characters', function () {
        return client
            .waitForVisible(upperCase, 5000)
            .click(upperCase)
            .click(digits)
            .click(special)
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                chai.expect(trimmed).to.match(/^[a-z]{8}$/)
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests uppercase characters and length 8
    it('tests uppercase characters', function () {
        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(digits)
            .click(special)
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                chai.expect(trimmed).to.match(/^[A-Z]{8}$/)
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests digits and length 8
    it('tests digits', function () {
        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(upperCase)
            .click(special)
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                chai.expect(trimmed).to.match(/^[0-9]{8}$/)
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests special characters and length 8
    it('tests special characters', function () {
        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(upperCase)
            .click(digits)
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                chai.expect(trimmed).to.match(/^[!@#$%_-]{8}$/)
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests prevent repeated characters using digits and length 10
    it('tests prevent repeated characters', function () {
        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(upperCase)
            .click(special)
            .click(repeated)
            .setValue('#field_length', '10')
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                chai.expect(trimmed).to.match(/^(?:([0-9])(?!.*\1)){10}$/)
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests all parameters and length 69 (maximum possitble length given no repeated characters)
    it('tests all parameters', function () {
        return client
            .waitForVisible(repeated, 5000)
            .click(repeated)
            .setValue('#field_length', '69')
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                chai.expect(trimmed).to.match(/^(?:([a-zA-Z0-9!@#$%_-])(?!.*\1)){69}$/)
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests no parameters and length 8
    it('tests no parameters', function () {
        return client
            .waitForVisible(lowerCase, 5000)
            .click(lowerCase)
            .click(upperCase)
            .click(digits)
            .click(special)
            .getAttribute(generateButton, "disabled").then(function (text) {
                assert.strictEqual(text, 'true', `generate button should be disabled, '${text}' !== 'true'`);
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests length 0 and default parameters
    it('tests length 0', function () {
        return client
            .waitForVisible(lowerCase, 5000)
            .setValue('#field_length', '0')
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                assert.strictEqual(trimmed, '');
            })
            .click(cancelButton)
            .click(mainButton);
    });

    // tests length 2048 and default parameters
    it('tests length 2048', function () {
        return client
            .waitForVisible(lowerCase, 5000)
            .setValue('#field_length', '2048')
            .click(generateButton)
            .getValue('#field_password').then(function (text) {
                // Trims the trailing comma
                var trimmed = String(text);
                trimmed = trimmed.replace(',', '');
                assert.strictEqual(trimmed.length, 2048);
            })
    });

    after(client.end);
});
