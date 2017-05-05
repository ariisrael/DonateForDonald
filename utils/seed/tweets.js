if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var async = require('async')

const models = require('../../models')
const Tweet = models.Tweet

const config = require('../../config/worker')
const db = config.db

const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump

const Twitter = require('twitter'); // Twitter API
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
    async.eachOf(data, (t, idx, nextTweet) => {
      var text = getFullText(t);
      var id = t.id_str;
      var date = t.created_at;
      var tw = {text: text, id: id, _id: id, date: date, posted: date}
      saveTweet(tw, () => {
        nextTweet()
      })
    }, (err) => {
      if (times < 16) {
        times++
        var tw = data[data.length - 1]
        var id = tw.id_str
        seedTweets(id)
      } else {
        process.exit(0)
      }
    })
  })
}

function saveTweet(tweet, callback) {
  Tweet.findById(tweet.id, (err, t) => {
    if (err) {
      console.error("error grabbing tweet", err)
      return callback()
    }
    if (t) {
      t.text = tweet.text
      t.posted = tweet.posted
      t.save((err) => {
        if (err) {
          console.error("error creating tweet", err)
        }
        return callback()
      })
    } else {
      Tweet.create(tweet, (err, t) => {
        if (err) {
          console.error("error creating tweet", err)
        }
        return callback()
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
