const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 5000));
if (process.env.NODE_ENV !== 'production') {
  app.set('baseUrl', 'localhost:' + app.get('port'))
} else if (process.env.BASE_URL) {
  app.set('baseUrl', process.env.BASE_URL)
} else {
  app.set('baseUrl', 'https://hackthecyber.herokuapp.com/')
}

module.exports = app
