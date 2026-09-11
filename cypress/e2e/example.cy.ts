describe('Navigation principale', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('affiche la liste des sessions', () => {
    cy.contains('h1', 'Sessions').should('be.visible')
    cy.contains('button', '+ Nouvelle Session').should('be.visible')
  })

  it('permet d ouvrir la bibliothèque de PNJ', () => {
    cy.contains('a', 'Bibliothèque de PNJ').click()
    cy.url().should('include', '/pnjs')
    cy.contains('h1', 'Bibliothèque de PNJ').should('be.visible')
  })
})
