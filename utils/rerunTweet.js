if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var config = require('../config/worker')

const workerEmitter = require('../workers/workerEmitter')
const analyzeTweet = require('../workers/analyzeTweet')

var Timer = require('timer-machine')

const createLogger = require('logging').default;
const log = createLogger('rerunTweet');

const models = require('../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User

var db = config.db


workerEmitter.once('doneProcessing', () => {
  log.info('finished')
  process.exit(0)
})

db.once('open', function() {
  if (!process.env.TWEET_ID) {
    log.error("Please set the tweet id in the environment variable TWEET_ID.")
    process.exit(1)
  }
  Tweet.findOne({_id: process.env.TWEET_ID}, (err, tweet) => {
    log.info('rerunning analysis on ', tweet.text)
    Timer.get(tweet.id).start()
    analyzeTweet(tweet, false)

  })
})
