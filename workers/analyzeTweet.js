const config = require('../config/worker'); // Credentials
const async = require('async')
var makeDonation = require('./donate')
var popularTerms = require('./popularTerms')

const models = require('../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User
const workerEmitter = require('./workerEmitter')

const createLogger = require('logging').default;
const log = createLogger('processUsers');

const app = require('../app')

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
      async.eachOfSeries(users, (user, idx, nextUser) => {
        if (aggregateDonations[user._id]) {
          log.info('user ', user.name || user.email, ' has ', aggregateDonations[user._id], ' in donations')
          user.aggregateDonations = aggregateDonations[user._id]
        } else {
          user.aggregateDonations = 0
        }
        usersBucket.push(user)
        if (usersBucket.length == 10 || idx == (users.length - 1)) {
          log.info('processing bucket with ', usersBucket.length, ' users at index ', idx)
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
        workerEmitter.emit('doneProcessing')
        app.set('workerProcessing', false)
      })
    })
  })
}

function processUsers(tweet, testing, users, usersCallback) {
  async.each(users, (user, nextUser) => {
    processUser(tweet, testing, user, (err) => {
      log.info('finished with user: ', user.name || user.email)
      nextUser()
    })
  }, (err) => {
    usersCallback()
  })
}

function processUser(tweet, testing, user, nextUser) {
  if (!user.pandaUserId && !user.testUser) {
    log.info('user ', user.name || user.email, ' does not have a panda user id')
    return nextUser()
  }
  if (user.monthlyLimit) {
    if (user.aggregateDonations < user.monthlyLimit) {
      log.info('user', user.name || user.email,
        ' has ' , user.aggregateDonations,
        ' in donations, under their monthly limit', user.monthlyLimit)
      checkUserTriggers(user, tweet, testing, function() {
        nextUser()
      })
    } else {
      log.info('user', user.name || user.email,' has ', user.aggregateDonations,
      ' in donations, above their monthly limit', user.monthlyLimit)
      nextUser()
    }
  } else {
    log.info('user', user.name || user.email,' has no monthly limit')
    checkUserTriggers(user, tweet, testing, function() {
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
        return log.error('error grabbing triggers for user ', user.name || user.email, 'error: ', err)
      } else {
        cb()
        return log.info('there are no triggers for user ', user.name || user.email)
      }
    }
    log.info('grabbed triggers for user', user.name || user.email)

    async.eachSeries(triggers, (trigger, triggerFinishedCallback) => {
      log.info('analyzing trigger', trigger.name)
      var keyword = escapeRegExp(trigger.name)
      var re = new RegExp(keyword, 'i')
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
