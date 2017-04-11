const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 5000));
if (process.env.NODE_ENV !== 'production') {
  app.set('base_url', 'localhost:' + app.get('port'))
} else if (process.env.BASE_URL) {
  app.set('baseUrl', process.env.BASE_URL)
} else {
  app.set('base_url', 'https://hackthecyber.herokuapp.com/')
}

module.exports = app
