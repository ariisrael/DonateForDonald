var config = require('../config/worker')
var models = require('../models')
var Tweet = models.Tweet
var Trigger = models.Trigger
var tweetUtils = require('../utils/tweet')
var _ = require('lodash')

var mkTweetObject = tweetUtils.mkTweetObject
var updateTweetObject = tweetUtils.updateTweetObject
var workerEmitter = config.workerEmitter
var numToAnalyze = 0;
var numAnalyzed = 0;

workerEmitter.on('analysisFinished', () => {
  numAnalyzed++
  if (numAnalyzed === numToAnalyze) {
    console.log('analysis done')
    workerEmitter.emit('scheduleTweetGrabbing')
  }
})

function analyzeTweets() {
  // reset this every time
  console.log('running analysis')
  numAnalyzed = 0
  Trigger.find((err, ts) => {
    if (err || !ts || !ts.length) {
      if (err) {
        console.log('error grabbing triggers', err)
      } else {
        console.log('there are no triggers')
      }
      return workerEmitter.emit('scheduleTweetGrabbing')
    }
    triggers = ts
    var numTriggers = triggers.length
    Tweet.find({analyzed: false}, (error, tweets) => {
      if (error || !tweets || !tweets.length) {
        if (err) {
          console.log('error grabbing tweets', err)
        } else {
          console.log('there are no tweets')
        }
        return workerEmitter.emit('scheduleTweetGrabbing')
      }
      var numTweets = tweets.length;
      numToAnalyze = numTweets + numTriggers;
      for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i]
        analyzeTweet(tweet, triggers)
      }
      // save only once, after the analysis is done
      saveTweetsAndTriggers(tweets, triggers)
    })
  })
}

function analyzeTweet(tweet, triggers) {
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    for (var j = 0; j < trigger.words.length; j++) {
      var word = trigger.words[j]
      var re = new RegExp(word)
      if (re.exec(tweet.text)) {
        tweet.triggers.push(trigger.id)
        trigger.tweets.push(tweet.id)
      }
    }
  }
}

function saveTweetsAndTriggers(tweets, triggers) {
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i]
    trigger.tweets = _.uniqWith(trigger.tweets, (a, b) => {
      return a.equals(b)
    })
    trigger.save((err) => {
      if (err) {
        console.log(trigger.name, err)
      }
      workerEmitter.emit('analysisFinished')
    })
  }
  for (var i = 0; i < tweets.length; i++) {
    var tweet = tweets[i]
    tweet.triggers = _.uniqWith(tweet.triggers, (a, b) => {
      return a.equals(b)
    })
    tweet.analyzed = true
    tweet.save((err) => {
      if (err) {
        console.log(tweet.text, err)
      }
      workerEmitter.emit('analysisFinished')
    })
  }
}

module.exports = exports = {
  analyzeTweets: analyzeTweets
}
