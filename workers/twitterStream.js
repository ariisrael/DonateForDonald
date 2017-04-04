const config = require('../config/worker'); // Credentials

const Twitter = require('twit'); // Twitter API
const T = new Twitter(config.twitterCreds);
const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump

const models = require('../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User

var makeDonation = require('./donate')
var popularTerms = require('./popularTerms')

// Create new stream filtering statuses by user (including retweets, replies)
var stream = T.stream('statuses/filter', { follow: TRUMP_USER_ID});

// Connect to Twitter API and start streaming
stream.on('tweet', function (tweet) {
  // Only parse tweets from @realDonaldTrump
  if (tweet.user.id === TRUMP_USER_ID) {
    var text = getFullText(tweet);
    var id = tweet.id;
    var date = tweet.created_at;
    saveTweet({text: text, id: id, _id: id, date: date})
  }
});

function getFullText(tweet) {
  if (tweet.truncated && tweet.extended_tweets && tweet.extended_tweet.full_text) {
    return tweet.extended_tweet.full_text;
  }
  return tweet.text;
}

function saveTweet(tweet) {
  var t = new Tweet(tweet)
  t.save((err) => {
    if (err) {
      return console.log(err)
    }
    analyzeTweet(t)
  })
}

function analyzeTweet(tweet) {
  User.find().exec((err, users) => {
    users.forEach((user) => {
      Trigger.find({
        userId: user.id
      }).exec((err, triggers) => {
        if (err || !triggers || !triggers.length) {
          if (err) {
            return console.log('error grabbing triggers', err)
          } else {
            return console.log('there are no triggers')
          }
        }

        var donation;
        for (trigger in triggers) {
          // loop through the keywords
          for (keyword in trigger.keywords) {
            var re = new RegExp(keyword)
            // check if there's a match
            // a potential optimization is to create only
            // a single regex for all keywords
            if (re.exec(tweet.text)) {
              donation = makeDonation(user, trigger, tweet)
              // on a single tweet, we only want to donate once per user,
              // so we break out of the loop
              break
            }
          }
          // similarly, we break out of this loop if we have a donation already
          if (donation) {
            break
          }
        }
      })
    })
  })

  popularTerms()
}
