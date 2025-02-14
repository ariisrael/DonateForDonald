var app = require('../app')
const url = require("url")
const User = require('../models/user')
const pandapay = require('../config/pandapay')

const models = require('../models');
const Tweet = models.Tweet;

const createLogger = require('logging').default;
const log = createLogger('routes/middleware');

require('./session')

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && app.get('forcehttps')) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next()
})

// this is our generic middleware that's applied to everything
app.use(function (req, res, next) {
  // res.locals is always passed to the template,
  // so ones that should be accessible from almost any template are set here

  // Setup a query
  res.locals.query = {}

  var parsedUrl = url.parse(req.originalUrl, true)
  var query = parsedUrl.query;
  if (query) res.locals.query = query

  var protocol = req.protocol
  if (process.env.NODE_ENV === 'production') {
    protocol = "https"
  }

  res.locals.url = protocol + '://' + req.get('host') + req.originalUrl;

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
      social: (req.user.social) ? req.user.social : undefined,
      skipSocial: (req.user.skipSocial) ? req.user.skipSocial : undefined,
      monthlyLimit: (req.user.monthlyLimit) ? req.user.monthlyLimit : undefined,
      paymentToken: (req.user.paymentToken) ? req.user.paymentToken : undefined,
      notification: (req.user.notification) ? req.user.notification : undefined,
      emailConfirmed: (req.user.emailConfirmed) ? req.user.emailConfirmed : undefined,
    }
  } else {
    res.locals.user = null
  }
  res.locals.env = process.env.NODE_ENV
  if (process.env.NODE_ENV !== 'production') {
    res.locals.development = true;
  }

  res

  res.locals.pandapay = {
    src: pandapay.src
  }

  if (process.env.NODE_ENV !== 'production') {
    res.locals.pandapay.public = pandapay.test.public
  } else {
    // TODO: change this in production
    res.locals.pandapay.public = pandapay.live.public
  }
  next()
})

app.use((req, res, next) => {
  Tweet.findOne({
    testTweet: {
      $ne: true
    }
  })
    .sort({
      posted: -1
    })
    .exec((err, tweet) => {
      if (err) {
        log.error('error getting most recent tweet', err)
      }

      res.locals.mostRecentTweet = tweet
      next();

    })
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
