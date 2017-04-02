if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const models = require('../models')
const Tweet = models.Tweet

const Twitter = require('twit'); // Twitter API
const T = new Twitter(config.twitter);

mongoose.connection.once('open', function() {
  seedTweets()
})

var seedTweets() {
  var query = {
    screen_name: 'realDonaldTrump',
    count: 1000,
    tweet_mode: 'extended'
  }
  if (options) {
    query.count = options.count;
  }
  T.get('statuses/user_timeline', query, function(err, data, response) {
    if (err) {
      return console.error(err)
    }
    data.forEach((d) => {
      var text = getFullText(tweet);
      var id = tweet.id;
      var date = tweet.created_at;
    })
  })
}

function saveTweet(tweet) {
  Tweet.find(tweet.id, (err, tweet) => {
    if (err) {
      return console.error(err)
    }
    if (tweet) return;

    Tweet.create(tweet, (err, t) => {
      if (err) {
        return console.error(err)
      }
    })
  })
}

function getFullText(tweet) {
  if (tweet.truncated && tweet.extended_tweets && tweet.extended_tweet.full_text) {
    return tweet.extended_tweet.full_text;
  }
  return tweet.text;
}
