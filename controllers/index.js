// Export all controllers
const charitiesController = require('./charities');
const triggersController = require('./triggers');
const usersController = require('./users');
const donationsController = require('./donations');
const tweetsController = require('./tweets');
const homeController = require('./home');

module.exports = {
  charities: charitiesController,
  triggers: triggersController,
  users: usersController,
  donations: donationsController,
  tweets: tweetsController,
  home: homeController,
};
