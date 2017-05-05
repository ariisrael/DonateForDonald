if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var config = require('../config/worker')

const workerEmitter = require('../workers/workerEmitter')
const analyzeTweet = require('../workers/analyzeTweet')
const async = require('async')

var Timer = require('timer-machine')

const createLogger = require('logging').default;
const log = createLogger('rerunTweet');

const models = require('../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User

var db = config.db

db.once('open', function() {
  if (!process.env.TWEET_ID && !process.env.RERUN_NUMBER) {
    log.error("Please set the tweet id in the environment variable TWEET_ID or set the number to rerun in RERUN_NUMBER.")
    process.exit(1)
  }
  if (process.env.TWEET_ID) {
    workerEmitter.once('doneProcessing', () => {
      log.info('finished')
      process.exit(0)
    })
    Tweet.findOne({_id: process.env.TWEET_ID}, (err, tweet) => {
      log.info('rerunning analysis on ', tweet.text)
      Timer.get(tweet.id).start()
      analyzeTweet(tweet, false)
    })
  } else if (process.env.RERUN_NUMBER) {
    Tweet.find({
      testTweet: {
        $ne: true
      }
    })
    .limit(parseInt(process.env.RERUN_NUMBER))
    .sort({
      posted: -1
    })
    .exec((err, tweets) => {
      log.info('here')
      log.info(err)
      log.info(tweets)
      async.eachSeries(tweets, (tweet, nextTweet) => {
        log.info('rerunning analysis on ', tweet.text)
        Timer.get(tweet.id).start()
        analyzeTweet(tweet, false)
        workerEmitter.once('doneProcessing', () => {
          log.info('finished')
          nextTweet()
        })
      }, (err) => {
        process.exit(0)
      })
    })
  }
})
