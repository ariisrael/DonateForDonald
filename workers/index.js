var config = require('../config/worker')

var popularTerms = require('./popularTerms')

const createLogger = require('logging').default;
const log = createLogger('worker');
const app = require('../app')
const workerEmitter = require('./workerEmitter')

var db = config.db

db.once('open', function() {
  require('./twitterStream')

  // this should be seeded immediately when it starts
  // (should this also be in a cron job?)
  popularTerms()
})

process.on('SIGTERM', () => {
  if (app.get('workerProcessing')) {
    workerEmitter.once('doneProcessing', () => {
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
})
