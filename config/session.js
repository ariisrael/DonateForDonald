var app = require('../index')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var passport = require('passport')
var MongoStore = require('connect-mongo')(session)
var RedisStore = require('connect-redis')(session)

// redis isn't needed to run the app
// it will be slightly faster in production
// but it will work just as well with mongo for almost everything
var store;
if (process.env.NODE_ENV === 'production' || process.env.USE_REDIS_SESSION) {
  var redis = require('redis')
  store = new RedisStore({
    url: process.env.REDIS_URL
  })
} else {
  var mongoose = require('./mongo')
  store = new (require('express-sessions'))({
     storage: 'mongodb',
     instance: mongoose,
     collection: 'sessions',
     expire: 86400
  })
}

var sessionSecret = process.env.SESSION_SECRET || 'trump has a toupe'

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(session({
    secret: sessionSecret,
    cookie: { maxAge: 2628000000 },
    store: store
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser(sessionSecret))
