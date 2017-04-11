var config = require('../config/worker')

var popularTerms = require('./popularTerms')

var db = config.db

db.once('open', function() {
  require('./twitterStream')

  // this should be seeded immediately when it starts
  // (should this also be in a cron job?)
  popularTerms()
})
