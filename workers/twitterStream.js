const config = require('../config/worker'); // Credentials
const async = require('async')

const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump
const GOP_CLUSTER_FUCK_ID = '3388526333'; // User ID for @GOPClusterFuck
const models = require('../models')
const Tweet = models.Tweet
const app = require('../app')

const createLogger = require('logging').default;
const log = createLogger('twitterStream');

var Timer = require('timer-machine')

const analyzeTweet = require('./analyzeTweet')

const setupStream = require('./setupStream')
const stream = setupStream()

stream.on('tweet', (tweet) => {
  // Only parse tweets from @realDonaldTrump
  Timer.get(tweet.id_str).start()
  if (tweet.user.id == TRUMP_USER_ID) {
    app.set('workerProcessing', true)
    log.info("new tweet: ", getFullText(tweet))
    log.info("matches trump!")
    prepareTweet(tweet)
  } else if (tweet.user.id == GOP_CLUSTER_FUCK_ID) {
    app.set('workerProcessing', true)
    log.info("new tweet: ", getFullText(tweet))
    log.info("matches GOPClusterFuck!")
    prepareTweet(tweet, true)
  } else {
    Timer.destroy(tweet.id_str)
  }
})

function prepareTweet(tweet, testing) {
  var text = getFullText(tweet);
  var id = tweet.id_str;
  var date = tweet.created_at;
  var t = {text: text, id: id, _id: id, date: date, posted: date}
  log.info("about to save tweet: ", t)
  if (testing) {
    t.testTweet = true
  }
  saveTweet(t, testing)
}

function saveTweet(tweet, testing) {
  var t = new Tweet(tweet)
  log.info("saving tweet: ", JSON.stringify(t))
  t.save((err) => {
    log.info("saved tweet: ", JSON.stringify(t))
    if (err) {
      log.warn('error saving tweet: ', err)
    }
    analyzeTweet(t, testing)
  })
}

function getFullText(tweet) {
  if (tweet.truncated && tweet.extended_tweets && tweet.extended_tweet.full_text) {
    return tweet.extended_tweet.full_text;
  }
  if (tweet.full_text) {
    return tweet.full_text
  }
  return tweet.text;
}
