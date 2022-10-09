const src_url = 'https://www.gamesforthebrain.com/game/checkers/';
const PLAYER_PIECES = 12;

describe('Checkers', () => {
  it('Tests initial checkers moves', () => {
    cy.visit('/');

    // Start a new game by restarting
    cy.contains('Restart...').click();
    cy.contains('Select an orange piece to move.').should('be.visible');

    let firstPosition = cy.get('img[name="space42"]');
    let secondPosition = cy.get('img[name="space33"]');
    let thirdPosition = cy.get('img[name="space24"]');

    // Make your first move
    firstPosition.click();
    secondPosition.click();

    // Let computer move
    cy.get('img[name="space04"]').should('have.attr', 'src', 'me1.gif');
    cy.contains('Make a move.').should('be.visible');

    // Make your second move
    secondPosition.click();
    thirdPosition.click();

    // Let computer take your piece
    cy.get('img[name="space13"]').should('have.attr', 'src', 'me1.gif');

    // Make sure your piece is taken
    cy.get('img[src="you1.gif"]').should('have.length', PLAYER_PIECES - 1);

    // Start a new game
    cy.contains('Restart...').click();
    cy.contains('Select an orange piece to move.').should('be.visible');
  });
});
