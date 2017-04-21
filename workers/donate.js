const request = require('request');

const PANDAPAY = require('../config/pandapay');
const tweetAtTrump = require('./tweetAtTrump')
const donatedEmail = require('../utils/email').donatedEmail

const models = require('../models')
const Donation = models.Donation

var mode = 'test'
if (process.env.NODE_ENV === 'production') {
  mode = 'live' // If in production set mode to live
}

const pandapayURL = 'https://' + PANDAPAY[mode].private + '@api.pandapay.io/v1/donations';

function donationRequest(user, trigger, tweet, donation, cb) {
  var body = {
    source: user.paymenttoken,
    platform_fee: PANDAPAY.fee,
    amount: trigger.amount,
    currency: PANDAPAY.currency,
    destination: trigger.ein,
    receipt_email: user.email
  }

  request.post({url: url, body: body}, function(error, response, body) {
    donation.paid = true
    // Handle response error
    if(error) {
      console.error(error);
      donation.paid = false
      cb()
    }
    // Log callback parameters
    console.log('response:', response);
    console.log('body:', body);

    donation.save((err, d) => {
      if (err) {
        cb()
        return console.error(err)
      }
      if (trigger.social) {

      }
      var userName = user.name || user.email
      var userEmail = user.email
      donatedEmail(userName, user.email, tweet.text, tweet._id, function(err, body) {
        tweetAtTrump(user, tweet, trigger.charityId, trigger, cb)
      })
    })
  });
}

function makeDonation(user, trigger, tweet, cb) {
  donation = new Donation({
    userId: user._id,
    triggerId: trigger._id,
    amount: trigger.amount,
    charityId: trigger.charityId._id,
    tweetId: tweet.id
  })
  donationRequest(user, trigger, tweet, donation, cb)
  return donation
}

module.exports = exports = makeDonation
