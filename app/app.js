const express = require('express');

const createLogger = require('logging').default;
const log = createLogger('app/app');

const app = express();

app.set('port', (process.env.PORT || 5000));
if (process.env.NODE_ENV !== 'production') {
  app.set('baseUrl', 'http://localhost:' + app.get('port'))
} else if (process.env.BASE_URL) {
  app.set('baseUrl', process.env.BASE_URL)
} else {
  app.set('baseUrl', 'https://hackthecyber.herokuapp.com/')
}

if (process.env.NODE_ENV !== 'production') {
  app.set('forcehttps', false)
} else {
  app.set('forcehttps', true)
}

// This is the testing email I've been using
// in production we need a different one
var email = 'noreply@donatefordonald.org'
if (process.env.EMAIL) {
  email = process.env.EMAIL
}

app.set('email', email)

if (process.env.SEND_OPTIONAL_EMAIL) {
  app.set('sendOptionalEmail', true)
} else {
  app.set('sendOptionalEmail', false)
}

if (process.env.SEND_NO_EMAIL) {
  app.set('sendNoEmail', true)
} else {
  app.set('sendNoEmail', false)
}

module.exports = app
