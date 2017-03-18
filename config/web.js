/**
  Web and workers have different config bases,
  though at the end of the day they have a lot of similarities in their config

  They both need mongo, among other things,
  but they also require different things and this allows us to be selective in what we import

  All config is only run once, so there's no need to turn it into a function
**/

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// require('./session')
var mongoose = require('./mongo')
var facebook = require('./facebook')
var twitter = require('./twitter')
var google = require('./google')

module.exports = {
  db: mongoose.connection,
  facebook: facebook,
  twitter: twitter,
  google: google
}
