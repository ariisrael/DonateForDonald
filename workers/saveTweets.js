var config = require('../config/worker')
var Tweet = require('../models/tweet')
var tweetUtils = require('../utils/tweet')

var saveTweet = require('../utils/saveTweet').saveTweet

var mkTweetObject = tweetUtils.mkTweetObject
var updateTweetObject = tweetUtils.updateTweetObject

var tweetsSaved = 0;
var tweetsGrabbed;

var workerEmitter = config.workerEmitter

workerEmitter.on('tweetsSaved', () => {
  tweetsSaved++
  if (tweetsGrabbed === tweetsSaved) {
    console.log('finished saving new tweets')
    workerEmitter.emit('tweetSavingDone')
  }
})

workerEmitter.on('tweetQueryFailed', () => {
  workerEmitter.emit('tweetSavingDone')
})

function getAndSaveTweets() {
  console.log('running twitter queries')
  // reset this pretty quickly
  tweetsSaved = 0
  var params = {q: 'from:realDonaldTrump', count: 100, include_entities: true}
  config.twitterClient.get('search/tweets', params, function(error, tweets, response) {
    if (error) {
      workerEmitter.emit('tweetQueryFailed')
      console.error('The twitter search failed.', error)
      return;
    }

    tweetsGrabbed = tweets.statuses.length

    for (var i = 0; i < tweets.statuses.length; i++) {
      saveTweet(tweets['statuses'][i], function() {
        workerEmitter.emit('tweetsSaved')
      })
    }
  });
}

module.exports = exports = getAndSaveTweets
