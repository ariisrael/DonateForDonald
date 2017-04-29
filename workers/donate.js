const request = require('request');

const PANDAPAY = require('../config/pandapay');
const tweetAtTrump = require('./tweetAtTrump')
const donatedEmail = require('../utils/email').donatedEmail
const paymentFailedEmail = require('../utils/email').paymentFailedEmail

const models = require('../models')
const Donation = models.Donation

var mode = 'test'
if (process.env.NODE_ENV === 'production') {
  mode = 'live' // If in production set mode to live
}

function donationRequest(user, trigger, tweet, donation, testing, cb) {
  // If the user does not have a payment token and it's not a test user,
  // do not go through this dance
  if (!user.paymenttoken && !user.testUser) {
    return
  }
  var body = {
    source: user.paymenttoken,
    platform_fee: PANDAPAY.fee,
    amount: (trigger.amount * 100).toString(),
    currency: PANDAPAY.currency,
    destination: trigger.ein,
    receipt_email: user.email
  }
  console.log('body: ', body)

  if (testing) {
    mode = 'test'
  }

  var pandapayURL = 'https://' + PANDAPAY[mode].private + '@api.pandapay.io/v1/donations';

  request.post({url: pandapayURL, json: body}, function(error, response, body) {
    donation.paid = true
    // Handle response error
    if(error) {
      console.error(error);
      donation.paid = false
    }
    // Log callback parameters
    // console.log('response:', response);
    console.log('body:', body);

    donation.save((err, d) => {
      if (err) {
        paymentFailedEmail(userName, user.email, trigger.charityId, function(err, body) {
          cb()
        })
        return console.error('A payment failed: ', err)
      }
      if (trigger.social) {
        var userName = user.name || user.email
        var userEmail = user.email
        donatedEmail(userName, user.email, tweet.text, tweet.id, function(err, body) {
          tweetAtTrump(user, tweet, trigger.charityId, trigger, cb)
        })
      } else {
        donatedEmail(userName, user.email, tweet.text, tweet.id, function(err, body) {
          cb()
        })
      }
    })
  });
}

function makeDonation(user, trigger, tweet, testing, cb) {
  console.log('making donation')
  console.log(tweet)
  donation = new Donation({
    userId: user._id,
    triggerId: trigger._id,
    amount: trigger.amount,
    charityId: trigger.charityId._id,
    tweetId: tweet.id
  })
  donationRequest(user, trigger, tweet, donation, testing, cb)
  return donation
}

module.exports = exports = makeDonation
