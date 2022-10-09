const request = require('supertest')('https://deckofcardsapi.com/api');
const assert = require('chai').assert;

let data = {
  deck_id: '',
  cards_number: 10,
  pile1: 'Julio1',
  pile2: 'Julio2',
  cards_pile1: [],
  cards_pile2: [],
};

const CARDS_PER_PILE = 5;

describe('Deck of Cards', () => {
  it('Create a deck', () => {
    return request
      .get('/deck/new/')
      .expect(200)
      .then((res) => {
        data.deck_id = res.body.deck_id;
        assert.hasAnyKeys(res.body, 'deck_id');
        assert.equal(res.body.success, true);
        assert.equal(res.body.shuffled, false);
      });
  });

  it('Shuffles the deck', () => {
    return request
      .get(`/deck/${data.deck_id}/shuffle/?deck_count=1`)
      .expect(200)
      .then((res) => {
        assert.equal(res.body.deck_id, data.deck_id);
        assert.equal(res.body.success, true);
        assert.equal(res.body.shuffled, true);
      });
  });

  it('Draw 3 cards from deck', () => {
    const CARDS_TO_DRAW = 3;

    return request
      .get(`/deck/${data.deck_id}/draw/`)
      .query({ count: CARDS_TO_DRAW })
      .expect(200)
      .then((res) => {
        assert.equal(res.body.deck_id, data.deck_id);
        assert.equal(res.body.success, true);
        assert.equal(res.body.cards.length, CARDS_TO_DRAW);
      });
  });

  describe('Manage Piles', () => {
    it('Make 2 piles with 5 cards each from deck', async () => {
      await request
        .get(`/deck/${data.deck_id}/draw/`)
        .query({ count: data.cards_number })
        .expect(200)
        .then((res) => {
          res.body.cards.map((card) => {
            data.cards_pile1.length < CARDS_PER_PILE
              ? data.cards_pile1.push(card.code)
              : data.cards_pile2.push(card.code);
          });
          assert.equal(res.body.deck_id, data.deck_id);
          assert.equal(res.body.success, true);
          assert.equal(res.body.cards.length, data.cards_number);
        });

      await request
        .get(`/deck/${data.deck_id}/pile/${data.pile1}/add/`)
        .query({ cards: data.cards_pile1.join(',') })
        .expect(200)
        .then((res) => {
          assert.equal(res.body.deck_id, data.deck_id);
          assert.equal(res.body.success, true);
        });

      await request
        .get(`/deck/${data.deck_id}/pile/${data.pile2}/add/`)
        .query({ cards: data.cards_pile2.join(',') })
        .expect(200)
        .then((res) => {
          assert.equal(res.body.deck_id, data.deck_id);
          assert.equal(res.body.success, true);
        });
    });

    it('List the cards in pile1 and pile2', async () => {
      await request
        .get(`/deck/${data.deck_id}/pile/${data.pile1}/list/`)
        .expect(200)
        .then((res) => {
          assert.equal(res.body.piles[data.pile1].cards.length, CARDS_PER_PILE);
          assert.equal(res.body.deck_id, data.deck_id);
          assert.equal(res.body.success, true);
        });

      await request
        .get(`/deck/${data.deck_id}/pile/${data.pile2}/list/`)
        .expect(200)
        .then((res) => {
          assert.equal(res.body.piles[data.pile2].cards.length, CARDS_PER_PILE);
          assert.equal(res.body.deck_id, data.deck_id);
          assert.equal(res.body.success, true);
        });
    });

    it('Shuffle pile1', () => {
      return request
        .get(`/deck/${data.deck_id}/pile/${data.pile1}/shuffle/`)
        .expect(200)
        .then((res) => {
          assert.equal(res.body.deck_id, data.deck_id);
          assert.equal(res.body.success, true);
        });
    });

    it('draw 2 cards from pile', () => {
      const CARDS_TO_DRAW = 2;

      return request
        .get(`/deck/${data.deck_id}/pile/${data.pile1}/draw/`)
        .query({ count: CARDS_TO_DRAW })
        .expect(200)
        .then((res) => {
          assert.equal(res.body.deck_id, data.deck_id);
          assert.equal(res.body.success, true);
          assert.equal(res.body.cards.length, CARDS_TO_DRAW);
        });
    });

    it('draw 3 cards from pile2', () => {
      const CARDS_TO_DRAW = 3;

      return request
        .get(`/deck/${data.deck_id}/pile/${data.pile2}/draw/`)
        .query({ count: CARDS_TO_DRAW })
        .expect(200)
        .then((res) => {
          assert.equal(res.body.deck_id, data.deck_id);
          assert.equal(res.body.success, true);
          assert.equal(res.body.cards.length, CARDS_TO_DRAW);
        });
    });
  });
});
