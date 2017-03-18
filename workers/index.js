var config = require('../config/worker')
var getAndSaveTweets = require('./saveTweets')
var updateTweets = require('./updateTweets')
var analyzeTweets = require('./analyzeTweets').analyzeTweets
var findDonors = require('./triggers')

const tenMinutes = 600000

var workerEmitter = config.workerEmitter

// This is a background script, and it has to be scheduled to run again
// It shouldn't run again until after it's finished,
// and even then only at a delay
// Using EventEmitter makes sense for this.
// This might make more sense as a heroku scheduled task
// open for discussion on that
workerEmitter.on('tweetSavingDone', () => {
  console.log('finished saving tweets')
  console.log('running analysis')
  analyzeTweets()
})

workerEmitter.on('scheduleTweetGrabbing', () => {
  console.log('finished running analysis')
  console.log('scheduling tweet grabbing')
  setTimeout(function() {
    getAndSaveTweets()
  }, tenMinutes)
})

config.db.once('open', function() {
  console.log('mongo db connection open')
  runTasks()
})

function runTasks() {
  console.log('running tasks')
  getAndSaveTweets()
  updateTweets()
  setTimeout(() => {
    findDonors()
  })
}
