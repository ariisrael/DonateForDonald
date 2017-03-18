var config = require('../config/worker')
var Tweet = require('../models/tweet')
var saveTweet = require('../utils/saveTweet').saveTweet

const oneHour = 3600000

var workerEmitter = config.workerEmitter

var totalTweets;
var tweetsUpdated = 0;
workerEmitter.on('tweetUpdated', () => {
  tweetsUpdated++
  if (totalTweets === tweetsUpdated) {
    workerEmitter.emit('tweetUpdatingDone')
  }
})

workerEmitter.on('tweetUpdatingDone', () => {
  console.log('finished updating tweets')
  console.log('resetting timeout function')
  scheduleUpdate()
})

workerEmitter.on('tweetQueryFailed', () => {
  scheduleUpdate()
  console.log('resetting timeout function')
})

/**
  This must be automatically scheduled in the future and then scheduled once an hour
**/

function updateTweets() {
  tweetsUpdated = 0
  console.log('running mongo queries for update')
  Tweet.find({analyzed: true},(error, doc) => {
    if (error) {
      console.log('update tweets failed', error)
      workerEmitter.emit('tweetUpdateQueryFailed')
      return;
    }
    totalTweets = doc.length
    var numTweets = 0;
    var tweetIds = [];
    for (var i = 0; i < doc.length; i++) {
      numTweets++
      var t = doc[i]
      tweetIds.push(t['twitter_id'])
      if (numTweets === 100 || numTweets === doc.length) {
        var params = {id: tweetIds.join(',')}
        updateTweets(params)
        numTweets = 0;
        tweetIds = [];
      }
    }
  })
}

function updateTweets(params) {
  console.log('running twitter queries for update')
  config.twitterClient.get('/statuses/lookup', params, function(error, tweets, response) {
    for (var i = 0; i < tweets.length; i++) {
      saveTweet(tweets[i], function() {
        workerEmitter.emit('tweetUpdated')
      })
    }
  })
}

function scheduleUpdate() {
  setTimeout(function() {
    updateTweets()
  }, oneHour)
}

module.exports = exports = scheduleUpdate
