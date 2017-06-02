const config = require('../config/worker'); // Credentials
const async = require('async')
var makeDonation = require('./donate')
var popularTerms = require('./popularTerms')
const monthlyLimitEmail = require('../utils/email').monthlyLimitEmail;


const models = require('../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User
const Term = models.Term
const workerEmitter = require('./workerEmitter')

const createLogger = require('logging').default;
const log = createLogger('analyzeTweet');

const app = require('../app')

var Timer = require('timer-machine')

var firstDayOfMonth = function() {
  var date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

module.exports = function analyzeTweet(tweet, testing) {
  log.info('analyzing tweet: ', JSON.stringify(tweet))
  var sentLimitEmails = {}
  getTerms(tweet, sentLimitEmails, testing)
}


function getTerms(tweet, sentLimitEmails, testing) {
  var matchedTerms = []
  var triggerQuery = { $or: [] }

  Term.find({}, (err, terms) => {
    log.info('grabbed terms')
    async.eachSeries(terms, (term, nextTerm) => {
      var keyword = escapeRegExp(term.term)
      var re = new RegExp(keyword, 'i')
      if (re.exec(tweet.text)) {
        log.info('found a match! ', term)
        matchedTerms.push(term)
        triggerQuery['$or'].push({name: term.term})
      }
      nextTerm()
    }, (err) => {
      log.info('finished analyzing terms for tweet: ', tweet)
      analyzeTriggers(tweet, triggerQuery, sentLimitEmails, testing)
    })

  })
}

function analyzeTriggers(tweet, triggerQuery, sentLimitEmails, testing) {
  getAggregateDonations((err, aggregateDonations) => {
    if (err) {
      log.info('error getting aggregate donations: ', err)
    }
    log.info('aggregate Donations', aggregateDonations)
    log.info('got aggregate donations')

    Trigger.find(triggerQuery)
      .populate('charityId userId')
      .exec((err, triggers) => {
        log.info('found triggers')
        var triggersBucket = []
        async.eachOfSeries(triggers, (trigger, idx, nextTrigger) => {
          log.info('trigger: ', trigger)
          if (trigger.userId && trigger.charityId) {
            triggersBucket.push(trigger)
          }
          if (triggersBucket.length == 10 || idx == (triggers.length - 1)) {
            processTriggers(tweet, aggregateDonations, triggersBucket, sentLimitEmails, testing, (err) => {
              triggersBucket = []
              nextTrigger()
            })
          } else {
            nextTrigger()
          }
        }, (err) => {
          if (err) log.error(err)
          log.info('finished with all triggers')
          Timer.get(tweet.id).stop()
          var seconds = (Timer.get(tweet.id).time()/1000)%60
          log.info('processing all triggers took: ', Timer.get(tweet.id).time(), ' ms', ' or ', seconds, ' seconds')
          Timer.destroy(tweet.id)
          log.info('===================================')
          workerEmitter.emit('doneProcessing')
          app.set('workerProcessing', false)
        })
      })
  })
}

function processTriggers(tweet, aggregateDonations, triggers, sentLimitEmails, testing, callback) {
  async.eachSeries(triggers, (trigger, nextTrigger) => {
    log.info('trigger: ', trigger)
    var user = trigger.userId;
    if (!user.pandaUserId) {
      log.info('user ', user.name || user.email, ' does not have a panda user id')
      return nextTrigger()
    }
    if (!trigger.active) {
      log.info('trigger ', trigger.name, ' for user ', user.name || user.email, ' is not active')
      return nextTrigger()
    }
    if (!checkUserLimit(user, aggregateDonations, trigger)) {
      if (sentLimitEmails[user.id]) {
        log.info('already sent user email for ', user.name, ' going to next trigger')
        return nextTrigger()
      } else {
        log.info('have not sent user email for ', user.name, ' sending it')
        return monthlyLimitEmail(user.name || user.email, user.email, function(err, body) {
          sentLimitEmails[user.id] = true
          nextTrigger()
        })
      }
    }
    log.info('making donation')
    makeDonation(trigger.userId, trigger, tweet, testing, (err) => {
      log.info('finished donation')
      nextTrigger(err)
    })
  }, (err) => {
    callback(err)
  })

}

function checkUserLimit(user, aggregateDonations, trigger) {
  if (!user.monthlyLimit) {
    log.info('user', user.name || user.email,' has no monthly limit')
    return true;
  }
  var aggregateDonation = 0;
  if (aggregateDonations[user._id]) {
    aggregateDonation = aggregateDonations[user._id]
  }
  var newAggregateDonation = aggregateDonation + trigger.amount
  if (aggregateDonation < user.monthlyLimit) {
    log.info('user', user.name || user.email,
      ' has ' , aggregateDonation,
      ' in donations, under their monthly limit ', user.monthlyLimit)
    if (newAggregateDonation <= user.monthlyLimit) {
      log.info('user', user.name || user.email,
        ' has ' , aggregateDonation,
        ' in donations, under their monthly limit ',
        user.monthlyLimit, ' with the new donation of ', newAggregateDonation)
      return true;
    }
  }
  log.info('user', user.name || user.email,' has ', aggregateDonation,
  ' in donations, above their monthly limit',
  user.monthlyLimit, ' with the new donation of ', newAggregateDonation || aggregateDonation)
  return false;
}

function getAggregateDonations(callback) {
  // This is a test log to ensure this works
  // remove if it does work
  log.info('the first day of the month is: ', firstDayOfMonth())
  Donation.aggregate([{
      $match: {
        createdAt: { $gte: firstDayOfMonth() },
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
        aggregateDonations[donation._id.toString()] = donation.amount
      })
      callback(err, aggregateDonations)
  })
}

function escapeRegExp(s) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
