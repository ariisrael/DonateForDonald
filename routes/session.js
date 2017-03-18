var app = require('../index')
var config = require('../config/web')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var passport = require('passport')
var MongoStore = require('connect-mongo')(session)
var RedisStore = require('connect-redis')(session)
var User = require('../models/user')

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
  var db = config.db
  store = new MongoStore({
    mongooseConnection: db
  })
}

var sessionSecret = process.env.SESSION_SECRET || 'trump has a toupe'


app.use(cookieParser(sessionSecret))
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({
    secret: sessionSecret,
    cookie: { maxAge: 2628000000 },
    store: store
}))
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  if (user) return done(null, user.id)
  done(null, null);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
