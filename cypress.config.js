const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.gamesforthebrain.com/game/checkers/',
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
});
