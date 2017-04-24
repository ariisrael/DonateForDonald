const app = require('../app');
const controllers = require('../controllers');

const express = require('express');
const _ = require('lodash');
const passport = require('passport');
const csurf = require('csurf')
const bodyParser = require('body-parser');

// Require middleware before routes
require('./middleware');
require('./auth');

const UserController = controllers.users;
const PageController = controllers.pages;
const TriggerController = controllers.triggers;
const DonationController = controllers.donations;
const TweetController = controllers.tweets;
const CharityController = controllers.charities;
const PaymentController = controllers.payments;

const LOGIN_ONLY = UserController.ensureAuthenticated;

const csrfProtection = csurf({ cookie: true })

app.use('/api', require('./api'));

// Don't enable this until after api, all api posts should be json decoded,
// all other values should be body parser decoded
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', PageController.landing);
app.get('/login', csrfProtection, UserController.loginGet);
app.get('/payment', csrfProtection, UserController.ensureAuthenticated, PageController.payment);
app.get('/reset', PageController.reset);
app.get('/settings', csrfProtection, UserController.ensureAuthenticated, PageController.settings);
app.get('/notifications', UserController.ensureAuthenticated,PageController.notifications);
app.get('/terms', PageController.terms);
app.get('/social', UserController.ensureAuthenticated, PageController.social);
app.get('/contact', csrfProtection, PageController.contact);
app.get('/donations', UserController.ensureAuthenticated,PageController.donations);
app.get('/triggers', UserController.ensureAuthenticated, PageController.triggers);
app.get('/leaderboard', PageController.leaderboard);
app.get('/charities', PageController.charities);
app.get('/faq', PageController.faq);
app.get('/tweets', PageController.tweets);
app.get('/confirm_email', UserController.confirmEmail)

app.get('/account', LOGIN_ONLY, (req, res) => {
  res.redirect('/settings')
})

// You cannot use put in a form, only via javascript
app.post('/account', csrfProtection, UserController.ensureAuthenticated, UserController.accountPut);
// you cannot use delete from a form, only via javascript
app.post('/delete-account', csrfProtection, UserController.ensureAuthenticated, UserController.accountDelete);

app.get('/signup', csrfProtection, UserController.signupGet);
app.post('/signup', csrfProtection, UserController.signupPost);

app.post('/login', csrfProtection, UserController.loginPost);

app.get('/logout', UserController.logout);

app.get('/forgot', UserController.forgotGet);
app.post('/forgot', UserController.forgotPost);

app.get('/payment', PaymentController.view)

app.get('/reset/:token', UserController.resetGet);
app.post('/reset/:token', UserController.resetPost);

app.get('/unlink/:provider', UserController.ensureAuthenticated, UserController.unlink);

app.get('/auth/facebook', function(req, res, next) {

  if (req.query && req.query.redirect) {
    req.session.redirectURI = decodeURIComponent(req.query.redirect)
  }

  passport.authenticate('facebook', { scope: ['email', 'user_location'] })(req, res, next)
});

app.get('/auth/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err || !user) {
      console.error('auth error: ', err)
      console.log('user: ', user)
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) {
        console.error('auth error: ', err)
        return res.redirect('/login')
      }
      if (req.session.redirectURI) {
        if (req.query.redirect = 'create') {
          var redirectPath = ''
          if (user.paymentToken && user.skipSocial) {
            redirectPath = '/triggers'
          } else if (user.paymentToken) {
            redirectPath = '/social'
          } else {
            redirectPath = '/payment'
          }
          return res.redirect(redirectPath)
        } else {
          return res.redirect(decodeURIComponent(req.session.redirectURI))
        }
      } else if (!(user.paymentToken)) {
        res.redirect('/payment');
      } else {
        res.redirect('/triggers');
      }
    })
  })(req, res, next);
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', function(req, res, next) {
  passport.authenticate('twitter', function(err, user, info) {
    if (err) {
      return res.redirect('/account')
    }
    return res.redirect('/triggers')
  })(req, res, next);
});
