const request = require('request');

const PANDAPAY = require('../config/pandapay');
const tweetAtTrump = require('./tweetAtTrump')
const donatedEmail = require('../utils/email').donatedEmail
const paymentFailedEmail = require('../utils/email').paymentFailedEmail

const models = require('../models')
const Donation = models.Donation

const createLogger = require('logging').default;
const log = createLogger('donate');

var mode = 'test'
if (process.env.NODE_ENV === 'production') {
  mode = 'live' // If in production set mode to live
}

function donationRequest(user, trigger, tweet, donation, testing, cb) {
  // If the user does not have a payment token and it's not a test user,
  // do not go through this dance
  if (!user.pandaUserId && !user.testUser) {
    cb()
    return
  }
  var body = {
    source: user.pandaUserId,
    platform_fee: PANDAPAY.fee,
    amount: (trigger.amount * 100).toString(),
    currency: PANDAPAY.currency,
    destination: trigger.charityId._id,
    receipt_email: user.email
  }
  log.info('body: ', body)

  if (testing) {
    mode = 'test'
    body.receipt_email = "gmeypop+pandapaytesting2@gmail.com"
  }

  var pandapayURL = 'https://' + PANDAPAY[mode].private + '@api.pandapay.io/v1/donations';

  request.post({url: pandapayURL, json: body}, function(error, response, body) {
    donation.paid = true
    // Handle response error
    if(error || body.error) {
      log.error('error making donation: ', error);
      donation.paid = false
    }
    // Log callback parameters
    // console.log('response:', response);
    log.info('response body:', body);

    donation.save((err, d) => {
      log.info('done making donation')
      if (user.testUser) {
        // if it's a test user, do not send an email
        cb()
        return;
      }
      if (err) {
        log.error('A donation failed to save: ', err)
      }
      if (!donation.paid) {
        log.error('the donation was not paid ')
        return paymentFailedEmail(userName, user.email, trigger.charityId, function(err, body) {
          cb()
        })
      }
      if (trigger.social) {
        log.info('the user has social')
        var userName = user.name || user.email
        var userEmail = user.email
        donatedEmail(userName, user.email, tweet.text, tweet.id, function(err, body) {
          tweetAtTrump(user, tweet, trigger.charityId, trigger, cb)
        })
      } else {
        log.info('the user does not have social')
        donatedEmail(userName, user.email, tweet.text, tweet.id, function(err, body) {
          cb()
        })
      }
    })
  });
}

function makeDonation(user, trigger, tweet, testing, cb) {
  log.info('making donation')
  Donation.findOne({
    userId: user._id,
    triggerId: trigger._id,
    tweetId: tweet.id,
  }).exec((err, donation) => {
    if (donation && donation.paid) {
      log.info('already donated')
      return cb()
    } else if (donation) {
      return donationRequest(user, trigger, tweet, donation, testing, cb)
    }

    donation = new Donation({
      userId: user._id,
      triggerId: trigger._id,
      amount: trigger.amount,
      charityId: trigger.charityId._id,
      tweetId: tweet.id,
      paid: false
    })
    donationRequest(user, trigger, tweet, donation, testing, cb)

  })
}

module.exports = exports = makeDonation
