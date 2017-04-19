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

function donationRequest(user, trigger, tweet, donation) {
  var body = {
    source: user.paymenttoken,
    platform_fee: PANDAPAY.fee,
    amount: trigger.amount,
    currency: PANDAPAY.currency,
    destination: trigger.ein,
    receipt_email: user.email
  }

  request.post({url: url, body: body}, function(error, response, body) {
    // Handle response error
    if(error) {
      console.error(error);
    }
    // Log callback parameters
    console.log('response:', response);
    console.log('body:', body);
    donation.paid = true
    donation.save((err, d) => {
      if (err) {
        return console.error(err)
      }
      if (trigger.social) {
        tweetAtTrump(user, tweet, trigger.charityId, trigger)
      }
      var userName = user.name || user.email
      var userEmail = user.email
      donatedEmail(userName, user.email, tweet.text, tweet._id)
    })
  });
}

function makeDonation(user, trigger, tweet) {
  donation = new Donation({
    userId: user._id,
    triggerId: trigger._id,
    amount: trigger.amount,
    charityId: trigger.charityId._id,
    tweetId: tweet.id
  })
  donation.save((err, donation) => {
    if (err) {
      return console.error(err)
    }
    donationRequest(user, trigger, tweet, donation)
  })
  return donation
}

module.exports = exports = makeDonation
