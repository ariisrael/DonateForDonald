var app = require('../index')
const url = require("url")
const User = require('../models/user')
const _ = require('lodash')

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
  res.locals.env = process.env.NODE_ENV
})

app.use(function(req, res, next) {
  if (!res.locals) {
    res.locals = {};
  }
  if (req.user) {
    res.locals.user = _.cloneDeep(req.user)
    res.locals.user.id = req.user.id
    res.locals.user._id = undefined
    res.locals.user.updatedAt = undefined
    res.locals.user.createdAt = undefined
    res.locals.user.admin = undefined
    res.locals.user.__v = undefined
  }
  next();
});
