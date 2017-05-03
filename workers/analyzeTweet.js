const config = require('../config/worker'); // Credentials
const async = require('async')
var makeDonation = require('./donate')
var popularTerms = require('./popularTerms')

const models = require('../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User

const createLogger = require('logging').default;
const log = createLogger('processUsers');

var Timer = require('timer-machine')

var firstDayOfMonth = function() {
  var date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}()

module.exports = function analyzeTweet(tweet, testing) {
  log.info('analyzing tweet: ', JSON.stringify(tweet))
  allTimes = []
  var date = new Date();
  firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  getUsers(tweet, testing)
  if (!testing) {
    popularTerms()
  }
}

function getUsers(tweet, testing) {
  var userQuery = {
    emailConfirmed: true
  }
  if (testing) {
    // if it's a test tweet, only analyze the test users
    userQuery.testUser = true
  } else {
    userQuery.testUser = {
      "$ne": true
    }
  }

  User.find(userQuery).exec((err, users) => {
    log.info('grabbed users')
    log.info('grabbed ' + users.length + ' users')
    var usersBucket = [];
    getAggregateDonations((err, aggregateDonations) => {
      async.eachSeries(users, (user, nextUser) => {
        if (aggregateDonations[user._id] && aggregateDonations[user._id].amount) {
          user.aggregateDonations = aggregateDonations[user._id].amount
        }
        usersBucket.push(user)
        if (usersBucket.length == 10) {
          processUsers(tweet, testing, usersBucket, (err) => {
            usersBucket = []
            nextUser()
          })
        } else {
          nextUser()
        }
      }, (err) => {
        log.info('finished with all users')
        Timer.get(tweet.id).stop()
        var seconds = (Timer.get(tweet.id).time()/1000)%60
        log.info('processing all users took: ', Timer.get(tweet.id).time(), ' ms', ' or ', seconds, ' seconds')
        Timer.destroy(tweet.id)
        log.info('===================================')
      })
    })
  })
}

function processUsers(tweet, testing, users, usersCallback) {
  async.each(users, (user, nextUser) => {
    processUser(tweet, testing, user, (err) => {
      nextUser()
    })
  }, (err) => {
    usersCallback()
  })
}

function processUser(tweet, testing, user, nextUser) {
  if (!user.paymenttoken && !user.testUser) {
    return nextUser()
  }
  if (user.monthlyLimit) {
    if (user.aggregateDonations < user.monthlyLimit) {
      checkUserTriggers(user, tweet, testing, function() {
        log.info('user has under the monthly limit')
        nextUser()
      })
    } else {
      nextUser()
    }
  } else {
    checkUserTriggers(user, tweet, testing, function() {
      log.info('user has no monthly limit')
      nextUser()
    })
  }
}

function getAggregateDonations(callback) {
  Donation.aggregate([{
      $match: {
        createdAt: { $gte: firstDayOfMonth },
      }
    }, {
      $group: {
        _id: "$userId",
        amount: { $sum: "$amount" }
      }
    }], (err, result) => {
      if (err) {
        log.error('error making aggregate donations ', err)
      }
      var aggregateDonations = {}
      result.forEach((donation) => {
        aggregateDonations[donation._id] = donation.amount
      })
      callback(err, aggregateDonations)
  })
}

function checkUserTriggers(user, tweet, testing, userFinishedCallback) {
  log.info('checking user triggers')
  Trigger.find({
    userId: user.id,
    active: true
  }).populate('charityId').exec((err, triggers) => {
    if (err || !triggers || !triggers.length) {
      if (err) {
        cb()
        return log.error('error grabbing triggers', err)
      } else {
        cb()
        return log.info('there are no triggers')
      }
    }
    log.info('grabbed triggers')

    async.eachSeries(triggers, (trigger, triggerFinishedCallback) => {
      var keyword = escapeRegExp(trigger.name)
      var re = new RegExp(keyword)
      // check if there's a match
      // a potential optimization is to create only
      // a single regex for all keywords
      if (re.exec(tweet.text)) {
        log.info('found a match!')
        log.info('trigger: ', JSON.stringify(trigger))
        makeDonation(user, trigger, tweet, testing, (err) => {
          triggerFinishedCallback(err)
        })
      } else {
        triggerFinishedCallback()
      }

    }, (err) => {
      if (err) {
        log.error('errored out in the donation flow', err)
      }
      userFinishedCallback()
    })
  })
}

function escapeRegExp(s) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
