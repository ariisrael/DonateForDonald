Tweet = require('../models/tweet')

function getText(tweet) {
  // check if the tweet is truncated
  if (tweet['truncated']) {
    // check if the extended_tweet exists and if the full text exists under that object
    if (tweet['extended_tweet'] && tweet['extended_tweet']['full_text']) {
      // if yes, then return that
      return tweet['extended_tweet']['full_text']
    }
  }
  // otherwise, return the text
  return tweet['text']
}

function mkTweetObject(tweet) {
  return new Tweet({
    twitter_id: tweet['id_str'],
    text: getText(tweet),
    created_at: tweet['created_at'],
    retweet_count: tweet['retweet_count'],
    favorite_count: tweet['favorite_count'],
    analyzed: false,
    donation: false
  })
}

function updateTweetObject(tweet, update) {
  if (update['retweet_count']) {
    tweet.retweet_count = update['retweet_count']
  }
  if (update['favorite_count']) {
    tweet.favorite_count = update['favorite_count']
  }
  if (update['analyzed']) {
    tweet.analyzed = update['analyzed']
  }
  if (update['triggers']) {
    tweet.triggers = update['triggers']
  }
  return tweet
}

module.exports = exports = {
  getText: getText,
  mkTweetObject: mkTweetObject,
  updateTweetObject: updateTweetObject
}
