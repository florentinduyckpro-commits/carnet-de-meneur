describe('Workflows principaux', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('crée une session et ouvre sa page', () => {
    cy.visit('/')
    cy.contains('button', '+ Nouvelle Session').click()

    cy.get('dialog').should('be.visible')
    cy.get('#nameSession').type('Session Cypress')
    cy.get('dialog textarea').type('Une session créée par Cypress')
    cy.get('dialog').contains('button', 'Enregistrer').click()

    cy.contains('a', 'Session Cypress').should('be.visible').click()
    cy.url().should('match', /\/session\/[^/]+$/)
    cy.contains('h1', 'Session Cypress').should('be.visible')
    cy.contains('modifié le').should('be.visible')
  })

  it('crée puis modifie un PNJ', () => {
    cy.visit('/pnjs')
    cy.contains('button', '+ Nouveau PNJ').click()

    cy.get('dialog').should('be.visible')
    cy.get('#npc-name').type('PNJ Cypress')
    cy.get('#npc-personality').type('Personnalité de test')
    cy.get('dialog').contains('button', 'Enregistrer').click()

    cy.contains('h1', 'PNJ Cypress').should('be.visible')
    cy.contains('button', 'Modifier la fiche').click()
    cy.get('#npc-name').clear().type('PNJ Cypress modifié')
    cy.get('dialog').contains('button', 'Modifier').click()

    cy.contains('h1', 'PNJ Cypress modifié').should('be.visible')
    cy.get('h1').should(($headings) => {
      const titles = [...$headings].map((heading) => heading.textContent?.trim())
      expect(titles).not.to.include('PNJ Cypress')
    })
  })
})
