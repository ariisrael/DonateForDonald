if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const models = require('../models')
const Tweet = models.Tweet

const config = require('../config/worker')
const db = config.db

const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump

const Twitter = require('twitter'); // Twitter API
console.log(config.twitterCreds)
const T = new Twitter(config.twitterCreds);

db.once('open', function() {
  seedTweets()
})

var times = 0;

function seedTweets(max_id) {
  var query = {
    user_id: TRUMP_USER_ID,
    count: 200,
    tweet_mode: 'extended'
  }
  if (max_id) {
    query.max_id = max_id
  }
  T.get('statuses/user_timeline', query, function(err, data, response) {
    if (err) {
      return console.error("error grabbing tweets", err)
    }
    console.log(data.length)
    data.forEach((t, index) => {
      var text = getFullText(t);
      var id = t.id_str;
      var date = t.created_at;
      saveTweet({text: text, id: id, _id: id, date: date}, index)
      if (index === 196) {
        if (times < 16) {
          times++
          seedTweets(id)
        }
      }
    })
  })
}

function saveTweet(tweet, index) {
  Tweet.findById(tweet.id, (err, t) => {
    if (err) {
      return console.error("error grabbing tweet", err)
    }
    if (t) {
      t.text = tweet.text
      t.save((err) => {
        if (err) {
          return console.error("error creating tweet", err)
        }
      })
    } else {
      Tweet.create(tweet, (err, t) => {
        if (err) {
          return console.error("error creating tweet", err)
        }
      })
    }

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
