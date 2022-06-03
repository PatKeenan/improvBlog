export {}; // silence TS1208 error
describe('Login.cy.ts', () => {

  const basePath = Cypress.env("base_url");
  const test_email = Cypress.env("test_email");
  const test_password = Cypress.env("test_password");
  const token = Cypress.env("token");


  it('should visit', () => {
    cy.visit(basePath + '/signin')
    cy.clearCookie(token)
  })

  it('.type() - type into a DOM element', () => {
    // https://on.cypress.io/type
    cy.get('#email')
      .type(test_email).should('have.value', test_email)
      cy.get('#password')
      .type(test_password).should('have.value', test_password) 
  })
  // Clicking signing will push the user to the home page /
  it('.click() - sign in and check path', () =>{
      cy.get('button[type="submit"').click().wait(3000)
      cy.getCookie(token)
      cy.visit(basePath + '/posts/create').then(()=>{
        cy.get('h2').contains('Create New Post')
      })
  })
})
