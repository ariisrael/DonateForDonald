const config = require('../../config/worker'); // Credentials

var popularTerms = require('./popularTerms')

const T = new Twitter(config.twitterCreds);
const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump
const GOP_CLUSTER_FUCK_ID = '3388526333'; // User ID for @GOPClusterFuck
const models = require('../../models')
const Tweet = models.Tweet
const User = models.User

const rabbit = require('rabbit')

const createLogger = require('logging').default;
const log = createLogger('primary/twitterStream');

// Create new stream filtering statuses by user (including retweets, replies)
var stream = T.stream('statuses/filter', { follow: [TRUMP_USER_ID, GOP_CLUSTER_FUCK_ID] });

// Connect to Twitter API and start streaming
stream.on('tweet', function (tweet) {
  // Only parse tweets from @realDonaldTrump
  Timer.get(tweet.id_str).start()
  if (tweet.user.id == TRUMP_USER_ID) {
    log.info("new tweet: ", getFullText(tweet))
    log.info("matches trump!")
    prepareTweet(tweet)
  } else if (tweet.user.id == GOP_CLUSTER_FUCK_ID) {
    log.info("new tweet: ", getFullText(tweet))
    log.info("matches GOPClusterFuck!")
    prepareTweet(tweet, true)
  } else {
    Timer.destroy(tweet.id_str)
  }
});

function prepareTweet(tweet, testing) {
  var text = getFullText(tweet);
  var id = tweet.id_str;
  var date = tweet.created_at;
  var t = {text: text, id: id, _id: id, date: date}
  log.info("about to save tweet: ", t)
  if (testing) {
    t.testTweet = true
  }
  saveTweet(t, testing)
}

function saveTweet(tweet, testing) {
  var t = new Tweet(tweet)
  log.debug("saving tweet: ", JSON.stringify(t))
  t.save((err) => {
    log.debug("saved tweet: ", JSON.stringify(t))
    if (err) {
      return log.warn('error saving tweet: ', err)
    }
    queueTweet(t, testing)
  })
}

function queueTweet(t, testing) {

}

stream.on('disconnect', function (disconnectMessage) {
  log.warn('disconnected: ', disconnectMessage)
  stream.stop().start()
})

stream.on('error', function (error) {
  log.error('errored: ', JSON.stringify(error))
  // this is synchronous, no need to have a callback,
  // but it returns this so the functions can be chained.
  stream.stop().start()
})
