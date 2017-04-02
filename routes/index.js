const app = require('../index');
const controllers = require('../controllers');

const express = require('express');
const _ = require('lodash');
const passport = require('passport');

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

app.use('/api', require('./api'));

app.get('/', PageController.landing);
app.get('/login', PageController.login);
app.get('/payment', UserController.ensureAuthenticated, PageController.payment);
app.get('/reset', PageController.reset);
app.get('/settings', UserController.ensureAuthenticated, PageController.settings);
app.get('/notifications', UserController.ensureAuthenticated,PageController.notifications);
app.get('/terms', PageController.terms);
app.get('/social', UserController.ensureAuthenticated, PageController.social);
app.get('/contact', PageController.contact);
app.get('/donations', UserController.ensureAuthenticated,PageControllers.donations);
app.get('/triggers', UserController.ensureAuthenticated, PageController.triggers);
app.get('/leaderboard', PageController.leaderboard);
app.get('/charities', PageController.charities);
app.get('/faq', PageController.faq);
app.get('/tweets', PageController.tweets);

app.get('/account', UserController.ensureAuthenticated, UserController.accountGet);
app.put('/account', UserController.ensureAuthenticated, UserController.accountPut);
app.delete('/account', UserController.ensureAuthenticated, UserController.accountDelete);


app.get('/signup', UserController.signupGet);
app.post('/signup', UserController.signupPost);

app.get('/login', UserController.loginGet);
app.post('/login', UserController.loginPost);

app.get('/logout', UserController.logout);

app.get('/forgot', UserController.forgotGet);
app.post('/forgot', UserController.forgotPost);

app.get('/payment', PaymentController.view)

app.get('/reset/:token', UserController.resetGet);
app.post('/reset/:token', UserController.resetPost);

app.get('/unlink/:provider', UserController.ensureAuthenticated, UserController.unlink);

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
