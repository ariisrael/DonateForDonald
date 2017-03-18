"use strict";

const request = require('request');

module.exports = function(){

  var mode = 'test'; // Default in development set mode to test
  if(process.env.NODE_ENV === 'production') {
    mode = 'live'; // If in production set mode to live
  }

  // Load PandaPay config
  var PANDAPAY = require('../config/pandapay');

  class Customer {
    // Save information: source and receipt email
    constructor(props) {
      this.email = props.email;
      this.payment_token = props.payment_token;
    }
    charge: function(amount) {
      var key = PANDAPAY[mode].private; // Get source secret
    }
  }

  class Donation {
    constructor(props) {
      this.source = props.customer.payment_token;
      this.platform_fee = PANDAPAY.fee;
      this.amount = props.amount;
      this.currency = PANDAPAY.currency;
      this.destination = props.destination;
      this.receipt_email = props.customer.email;
    }

    create: function(cb) {
      // Build URL with basic authentication
      var url = function(){
        return 'https://' + PANDAPAY[mode].private + '@api.pandapay.io/v1/donations';
      }();
      // Post donation to PandaPay API
      var body = Object.assign({}, this);
      request.post({url: url, body: body}, function(error, response, body) {
        // Handle response error
        if(error) this.failed(error);
        // Log callback parameters
        console.log('response:', response);
        console.log('body:', body);
        cb()
      });
    }

    // Define donation exception handling
    failed: function(error) {
      if(mode === 'test') console.log(error);
      return throw new Error(); // Log and throw unhandled error
    }
  }

  // Make classes public
  return {
    'Customer': Customer,
    'Donation': Donation,
    'Grant': Grant
  }
}();
