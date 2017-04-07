const app = require('../index');
const controllers = require('../controllers');

const express = require('express');
const _ = require('lodash');
const passport = require('passport');
const csurf = require('csurf')

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

const csrfProtection = csurf({ cookie: true })

app.use('/api', require('./api'));

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

app.get('/account', UserController.ensureAuthenticated, UserController.accountGet);
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

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err || !user) {
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.redirect('/login')
      }
      if (info && info.newUser) {
        if(!(user.paymentToken)) {
          return res.redirect('/payment');
        } else {
          return res.redirect('/triggers');
        }
      } else {
        return res.redirect('/')
      }
    })
  })(req, res, next);
});

app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
