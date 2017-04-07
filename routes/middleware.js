var app = require('../index')
const url = require("url")
const User = require('../models/user')

require('./session')

// this is our generic middleware that's applied to everything
app.use(function (req, res, next) {
  // res.locals is always passed to the template,
  // so ones that should be accessible from almost any template are set here

  // Setup a query
  res.locals.query = {}

  var parsedUrl = url.parse(req.url, true)
  var query = parsedUrl.query;
  if (query) res.locals.query = query

  next()
})

app.use(function(req, res, next) {
  if (!res.locals) {
    res.locals = {};
  }
  if (req.user) {
    res.locals.user = {
      email: (req.user.email) ? req.user.email : undefined,
      picture: (req.user.picture) ? req.user.picture : "https://myspace.com/common/images/user.png",
      name: (req.user.name) ? req.user.name : undefined,
      admin: (req.user.admin) ? req.user.admin : undefined,
      facebook: (req.user.facebook) ? req.user.facebook : undefined,
      twitter: (req.user.twitter) ? req.user.twitter : undefined,
      id: (req.user._id) ? req.user._id : undefined,
      donations: (req.user.donations) ? req.user.donations : undefined,
      triggers: (req.user.triggers) ? req.user.triggers : undefined,
      phone: (req.user.phone) ? req.user.phone : undefined,
      monthlyLimit: (req.user.monthlyLimit) ? req.user.monthlyLimit : undefined,
      paymentToken: (req.user.paymentToken) ? req.user.paymentToken : undefined,
      notification: (req.user.notification) ? req.user.notification : undefined,
      emailConfirmed: (req.user.emailConfirmed) ? req.user.emailConfirmed : undefined,
    }
  } else {
    res.locals.user = null
  }
  res.locals.env = process.env.NODE_ENV
  next()
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
