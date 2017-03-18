/**
  This is the config for the workers
  It'll get imported and used there.
  Some of these aren't just config
  e.g. I setup the connection to mongo here

  However, the rule with these files is the following: do no actual work
  Don't save things to the db, don't show anything to the user here,
  just be prepared to do that.
**/

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var mongoose = require('./mongo')
var twitterClient = require('./twitter').twitter
var EventEmitter = require('events')
var workerEmitter = new EventEmitter();

module.exports = {
  db: mongoose.connection,
  twitterClient: twitterClient,
  workerEmitter: workerEmitter
}
