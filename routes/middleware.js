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
      email: (req.user.email) ? req.user.email : null,
      picture: (req.user.picture) ? req.user.picture : "https://myspace.com/common/images/user.png",
      name: (req.user.name) ? req.user.name : null,
      admin: (req.user.admin) ? req.user.admin : null,
      facebook: (req.user.facebook) ? req.user.facebook : null,
      twitter: (req.user.twitter) ? req.user.twitter : null,
      id: (req.user._id) ? req.user._id : null,
      donations: (req.user.donations) ? req.user.donations : null,
      triggers: (req.user.triggers) ? req.user.triggers : null,
    }
  } else {
    res.locals.user = null
  }
  res.locals.env = process.env.NODE_ENV
  next()
})
