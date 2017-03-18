var Tweet = require('../models/tweet')
var tweetUtils = require('./tweet')
var mkTweetObject = tweetUtils.mkTweetObject
var updateTweetObject = tweetUtils.updateTweetObject

function saveTweet(tweet, callback) {
  var query = { twitter_id: tweet['id_str'] }

  Tweet.findOne(query, function(err, doc) {
    if (err) {
      console.error('There was an error in finding a tweet', err)
      callback()
    } else {
      var t;
      if (doc) {
        t = updateTweetObject(doc, tweet)
      } else {
        t = mkTweetObject(tweet)
      }
      t.save(function (err, savedTweet) {
        callback()
      })
    }
  })
}

module.exports = exports = {
  saveTweet: saveTweet
}
