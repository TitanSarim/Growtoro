/* eslint-disable no-undef */

const auth = {
  email: 'james@tree-totub.com',
  password: '12345678',
};

describe('Campaigns', () => {
  beforeEach(() => {
    // Check if the current URL contains the login page path

    cy.url().then((url) => {
      if (url.includes('/login')) {
        Cypress.on('uncaught:exception', (err, runnable) => {
          // Check if the error message contains the specific text you want to ignore
          if (err.message.includes('Uncaught TypeError: $2 is not a function')) {
            // Return false only for this specific error, let other errors propagate
            return false;
          }
          // For other errors, let Cypress handle them
          return true;
        });
      }
    });
  });

  it('Create a new campign', () => {
    cy.visit('http://localhost:3000/login');
    // wait for 1 seconds
    cy.wait(1000);

    // login with a user
    cy.get('#Email-address-2').type(auth.email);
    cy.get('#input-password').type(auth.password);
    cy.get('#input-password').type('{enter}');

    // click on a url
    cy.get('a[href*="/campaigns"]').click();
    cy.wait(3000);

    // click on new campaign button with add-new-campaign id
    cy.get('#add-new-campaign').click();

    // click on campaign input with Campaign Name attribute
    cy.get('[placeholder="Campaign Name"]').type('Test Campaign');
    cy.get('[placeholder="Campaign Name"]').type('{enter}');

    // click on campaign input with Campaign Name attribute
    cy.get('#Upload-CSV').click();

    // upload file
    cy.get('input[type="file"]').selectFile('./cypress/e2e/assets/2 - CSV_Data_2023_8_17 20_53.csv', { force: true });
    cy.get('button').contains('Continue').click();

    // select type of data with className `select-type` by 0 index
    cy.get('.select-type-1').click();
    cy.get('.select-item-2').click();

    cy.get('.select-type-2').click();
    cy.get('.select-item-1').click();

    // button that contains upload all text
    cy.get('button').contains('Upload All').click();
    cy.wait(1000);
    cy.get('button').contains('Upload').click();

    // type in in with placeholder placeholder="Leave empty to use previous step`s subject."
    cy.get('[placeholder="Leave empty to use previous step`s subject."]').type('Test Subject');
    cy.get('#quill-editor').type('Test Content');
    cy.get('#flow-save').click();

    // go to schedule
    cy.get('button[type="button"]').contains('Schedule').click();
    cy.get('button').contains('SAVE SCHEDULE').click();

    // select email from settings
    cy.get('#tags-standard').click();
    cy.get('#tags-standard').type('{downarrow}');
    cy.get('#tags-standard').type('{enter}');

    cy.get('#max_email').type('5');
    cy.get('#delay_email').type('5');
    cy.get('#complete_on_reply').click();
    cy.get('button').contains('Launch').click();
    cy.get('button').contains('Publish').click();
  });
});
