const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 5000));
if (process.env.NODE_ENV !== 'production') {
  app.set('baseUrl', 'http://localhost:' + app.get('port'))
} else if (process.env.BASE_URL) {
  app.set('baseUrl', process.env.BASE_URL)
} else {
  app.set('baseUrl', 'https://hackthecyber.herokuapp.com/')
}

// This is the testing email I've been using
// in production we need a different one
var email = 'noreply@donatefordonald.org'
if (process.env.EMAIL) {
  email = process.env.EMAIL
}

app.set('email', email)

if (process.env.SEND_DONATION_EMAIL) {
  app.set('sendDonationEmail', true)
} else {
  app.set('sendDonationEmail', false)
}

module.exports = app
