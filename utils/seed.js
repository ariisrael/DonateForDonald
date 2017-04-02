if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const models = require('../models')
const Tweet = models.Tweet

var T = new Twit({
  consumer_key:         'HSjDtq7x7IjkrcHzEbyMT8QvN',
  consumer_secret:      'V3ewc1zexgaY8A37pDZaLLT0zJ51VZpBsnUAmnfOWcf1zv694y',
  access_token:         '18880271-oMmdZ5mxjYe8PKnoEYe4j1FyDz6Wu4YoYOvHh5h8O',
  access_token_secret:  'uVeE5gM4z7i0L7HMLxndcUyyfzsNCbwluqJmEIv9cM7AU'
});

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
