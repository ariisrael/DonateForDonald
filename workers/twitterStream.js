const config = require('../config/worker'); // Credentials
const async = require('async')
const Twitter = require('twit'); // Twitter API
var makeDonation = require('./donate')
var popularTerms = require('./popularTerms')

const T = new Twitter(config.twitterCreds);
const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump
const GOP_CLUSTER_FUCK_ID = '3388526333'; // User ID for @GOPClusterFuck
const models = require('../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User

const createLogger = require('logging').default;
const log = createLogger('twitterStream');

var Timer = require('timer-machine')

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

function getFullText(tweet) {
  if (tweet.truncated && tweet.extended_tweets && tweet.extended_tweet.full_text) {
    return tweet.extended_tweet.full_text;
  }
  if (tweet.full_text) {
    return tweet.full_text
  }
  return tweet.text;
}

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
    analyzeTweet(t, testing)
  })
}

function analyzeTweet(tweet, testing) {
  log.info('analyzing tweet: ', JSON.stringify(tweet))
  var date = new Date();
  var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var userQuery = {
    emailConfirmed: true
  }
  if (testing) {
    // if it's a test tweet, only analyze the test users
    userQuery.testUser = true
  }

  User
    .find(userQuery)
    .exec((err, users) => {
      log.info('grabbed users')
      log.debug('grabbed ' + users.length + ' users')
      var usersBucket = [];

      async.eachSeries(users, (user, nextUser) => {

        usersBucket.push(user)
        if (usersBucket.length == 5) {
          processUsers(tweet, testing, usersBucket, (err) => {
            usersBucket = []
            nextUser()
          })
        } else {
          nextUser()
        }

      }, (err) => {
        log.info('finished with all users')
        Timer.get(tweet.id).stop()
        var seconds = (Timer.get(tweet.id).time()/1000)%60
        Timer.destroy(tweet.id)
        log.info('processing all users took: ', seconds, ' seconds')
        log.info('===================================')
      })


  })
  if (!testing) {
    popularTerms()
  }
}

function processUsers(tweet, testing, users, bucketCallback) {
  async.each(users, (user, nextUser) => {
    if (!user.paymenttoken && !user.testUser) {
      return nextUser()
    }
    if (user.monthlyLimit) {
      Donation.aggregate([{
          $match: {
            createdAt: { $gte: firstDayOfMonth },
            userId: user._id
          }
        }, {
          $group: {
            _id: "total",
            amount: { $sum: "$amount" }
          }
        }], (err, result) => {
        if (result[0].amount < user.monthlyLimit) {
          checkUserTriggers(user, tweet, testing, function() {
            log.debug('user has under the monthly limit')
            nextUser()
          })
        }
      })
    } else {
      checkUserTriggers(user, tweet, testing, function() {
        log.debug('user has no monthly limit')
        nextUser()
      })
    }
  }, (err) => {
    bucketCallback()
  })
}

function checkUserTriggers(user, tweet, testing, userFinishedCallback) {
  log.info('checking user triggers')
  Trigger.find({
    userId: user.id,
    active: true
  }).populate('charityId').exec((err, triggers) => {
    if (err || !triggers || !triggers.length) {
      if (err) {
        cb()
        return log.error('error grabbing triggers', err)
      } else {
        cb()
        return log.info('there are no triggers')
      }
    }
    log.info('grabbed triggers')

    async.eachSeries(triggers, (trigger, triggerFinishedCallback) => {
      var keyword = escapeRegExp(trigger.name)
      var re = new RegExp(keyword)
      // check if there's a match
      // a potential optimization is to create only
      // a single regex for all keywords
      if (re.exec(tweet.text)) {
        log.info('found a match!')
        log.info('trigger: ', JSON.stringify(trigger))
        makeDonation(user, trigger, tweet, testing, (err) => {
          triggerFinishedCallback(err)
        })
      } else {
        triggerFinishedCallback()
      }

    }, (err) => {
      if (err) {
        log.error('errored out in the donation flow', err)
      }
      userFinishedCallback()
    })
  })
}

function escapeRegExp(s) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
