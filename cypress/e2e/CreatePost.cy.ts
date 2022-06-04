import faker from "@faker-js/faker";
export {}
describe('CreatePost.cy.ts', () => {

  const basePath = Cypress.env("base_url");
  const test_email = Cypress.env("test_email");
  const test_password = Cypress.env("test_password");
  const token = Cypress.env("token");

  beforeEach(()=>{
    cy.request({
        method: 'POST',
        url: basePath + '/api/signin',
        body: { email: test_email, password: test_password },
      })
  })
 
  it('should Create Post', () => {
    cy.visit(basePath + '/posts/create').then(()=>{
        cy.get('h2').contains('Create New Post')
      })
      const title = faker.lorem.sentence(5);
      cy.getCookie(token)
      cy.get("#title").type(
          title
      )
      cy.get("#plot").type(
        faker.lorem.paragraph(1)
    )
    cy.get('form').submit().wait(4000)

    cy.get('h1').contains(title)

  })

  it('should Edit Post', () => {
    cy.get('#edit-button').click()
    cy.get('textarea[name="title"]').clear().type("Testing before delete")
    cy.get('#submit-button').click().wait(4000)
    cy.get('h1').contains("Testing before delete")
})

    it('should Delete Post', () => {
        cy.get('#delete-button').click().wait(4000)
        cy.get("h3").contains("Successfully delete post")
    })
})

