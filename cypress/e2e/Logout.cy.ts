export {}; // silence TS1208 error
describe('Login.cy.ts', () => {

  const basePath = Cypress.env("base_url");
  const test_email = Cypress.env("test_email");
  const test_password = Cypress.env("test_password");
  
  it('should logout', ()=>{
      cy.visit(basePath)
    cy.request({
        method: 'POST',
        url: basePath + '/api/signin',
        body: { email: test_email, password: test_password },
      }).wait(2000).reload()
      cy.get('#logout-button').click()
      cy.visit(basePath)
      cy.get('#login-button')
      cy.visit(basePath + '/users/4').wait(2000)
      cy.get('h2').contains("Sign In To Read Awesome Stuff")
  })
})
