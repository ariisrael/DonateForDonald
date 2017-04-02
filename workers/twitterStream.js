const config = require('./config.js'); // Credentials

const Twitter = require('twit'); // Twitter API
const T = new Twitter(config.twitter);
const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump

const Tweet = require('../models/tweet')
const Trigger = require('../models/trigger')
const Donation = require('../models/donation')

const donateNow = require('../utils/donate')

// Create new stream filtering statuses by user (including retweets, replies)
var stream = T.stream('statuses/filter', { follow: TRUMP_USER_ID});

// Connect to Twitter API and start streaming
stream.on('tweet', function (tweet) {
  // Only parse tweets from @realDonaldTrump
  if (tweet.user.id === TRUMP_USER_ID) {
    var text = getFullText(tweet);
    var id = tweet.id;
    var date = tweet.created_at;
    saveTweet({text: text, id: id, date: date})
  }
});

function getFullText(tweet) {
  if (tweet.truncated && tweet.extended_tweets && tweet.extended_tweet.full_text) {
    return tweet.extended_tweet.full_text;
  }
  return tweet.text;
}

saveTweet(tweet) {
  new t = Tweet(tweet)
  t.save((err) => {
    if (err) {
      return console.log(err)
    }
    // do analysis here
    Trigger.find().exec((err, triggers) => {
      if (err || !triggers || !triggers.length) {
        if (err) {
          console.log('error grabbing triggers', err)
        } else {
          console.log('there are no triggers')
        }
      }

      triggers.forEach((trigger) => {
        var m = false
        for (keyword in triggers.keywords) {
          var re = new RegExp(keyword)
          if (re.exec(tweet.text)) {
            m = true
            break
          }
          if (m) {
            var donation = new Donation({
              userId: trigger.userId,
              triggerId: trigger.id,
              amount: trigger.amount,
              tweetId: tweet.id
            })
            donation.save((err) => {
              if (err) {
                return console.error(err)
              }
              donateNow(donation)
            })
          }
        }
      })
    })
  })
}
