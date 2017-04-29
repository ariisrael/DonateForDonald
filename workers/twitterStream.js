const config = require('../config/worker'); // Credentials

const Twitter = require('twit'); // Twitter API
const T = new Twitter(config.twitterCreds);
const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump
const GOP_CLUSTER_FUCK_ID = '3388526333'; // User ID for @GOPClusterFuck

const models = require('../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User
const async = require('async')

var makeDonation = require('./donate')
var popularTerms = require('./popularTerms')

// Create new stream filtering statuses by user (including retweets, replies)
var stream = T.stream('statuses/filter', { follow: [TRUMP_USER_ID, GOP_CLUSTER_FUCK_ID] });

// Connect to Twitter API and start streaming
stream.on('tweet', function (tweet) {
  // Only parse tweets from @realDonaldTrump
  if (tweet.user.id == TRUMP_USER_ID) {
    console.log("new tweet: ", getFullText(tweet))
    console.log("matches trump!")
    prepareTweet(tweet)
  } else if (tweet.user.id == GOP_CLUSTER_FUCK_ID) {
    console.log("new tweet: ", getFullText(tweet))
    console.log("matches GOPClusterFuck!")
    prepareTweet(tweet, true)
  }
});

stream.on('disconnect', function (disconnectMessage) {
  console.log('disconnected: ', disconnectMessage)
  stream.stop().start()
})

stream.on('error', function (error) {
  console.log('errored: ', JSON.stringify(error))
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
  console.log("about to save tweet: ", t)
  if (testing) {
    t.testTweet = true
  }
  saveTweet(t, testing)
}

function saveTweet(tweet, testing) {
  var t = new Tweet(tweet)
  console.log("saving tweet: ", JSON.stringify(t))
  t.save((err) => {
    console.log("saved tweet: ", JSON.stringify(t))
    if (err) {
      return console.log(err)
    }
    analyzeTweet(t, testing)
  })
}

function analyzeTweet(tweet, testing) {
  console.log('analyzing tweet')
  console.log(tweet)
  var date = new Date();
  var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var userQuery = {}
  if (testing) {
    // if it's a test tweet, only analyze the test users
    userQuery.testUser = true
  }

  User
    .find(userQuery)
    .exec((err, users) => {
      console.log('grabbed users')
      async.eachSeries(users, (user, nextUser) => {
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
                console.log('user has under the monthly limit')
                nextUser()
              })
            }
          })
        } else {
          checkUserTriggers(user, tweet, testing, function() {
            console.log('user has no monthly limit')
            nextUser()
          })
        }
      })
  })
  if (!testing) {
    popularTerms()
  }
}

function checkUserTriggers(user, tweet, testing, cb) {
  console.log('checking user triggers')
  console.log(tweet)
  Trigger.find({
    userId: user.id,
    active: true
  }).populate('charityId').exec((err, triggers) => {
    if (err || !triggers || !triggers.length) {
      if (err) {
        cb()
        return console.log('error grabbing triggers', err)
      } else {
        cb()
        return console.log('there are no triggers')
      }
    }
    console.log('grabbed triggers')

    var donation;
    for (triggerIdx in triggers) {
      var trigger = triggers[triggerIdx]
      // loop through the keywords
      var keyword = trigger.name
      keyword = escapeRegExp(keyword)
      var re = new RegExp(keyword)
      // check if there's a match
      // a potential optimization is to create only
      // a single regex for all keywords
      if (re.exec(tweet.text)) {
        console.log('found a match!')
        console.log(tweet)
        donation = makeDonation(user, trigger, tweet, testing, cb)
        // on a single tweet, we only want to donate once per user,
        // so we break out of the loop
        break
      }
    }
  })
}

function escapeRegExp(s) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
