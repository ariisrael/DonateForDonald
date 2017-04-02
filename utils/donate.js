const request = require('request');
var PANDAPAY = require('../config/pandapay');

var mode = 'test'
if (process.env.NODE_ENV === 'production') {
  mode = 'live' // If in production set mode to live
}

const pandapayURL = 'https://' + PANDAPAY[mode].private + '@api.pandapay.io/v1/donations';

module.exports = function(user, trigger, tweet, donation) {
  var body = {
    source: user.paymenttoken,
    platform_fee: PANDAPAY.fee,
    amount: trigger.
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
    })
  });
}
