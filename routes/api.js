const express = require('express');

const app = require('../index');
const controllers = require('../controllers');

const TriggerController = controllers.triggers;
const UserController = controllers.users;
const DonationController = controllers.donations;
const TweetController = controllers.tweets;
const CharityController = controllers.charities;
const PaymentController = controllers.payments;
const TermsController = controllers.terms;

const ADMIN_ONLY = UserController.ensureAdmin;
const USER_ONLY = UserController.ensureAuthorized;
const LOGIN_ONLY = UserController.ensureAuthenticated;
const USER_QUERY = UserController.userQuery

var api = express.Router();

api.get('/triggers', LOGIN_ONLY, USER_QUERY, TriggerController.index);
api.get('/users', ADMIN_ONLY, UserController.index);
api.get('/charities', CharityController.index);
api.get('/tweets', TweetController.index);
api.get('/payments', ADMIN_ONLY, PaymentController.index);
api.get('/donations', ADMIN_ONLY, DonationController.index);
api.get('/terms', TermsController.index)

api.get('/triggers/:id', TriggerController.read);
api.get('/users/:id', USER_ONLY, USER_QUERY, UserController.read);
api.get('/charities/:id', CharityController.read);
api.get('/tweets/:id', TweetController.read);
api.get('/donations/:id', LOGIN_ONLY, USER_QUERY, DonationController.read);
api.get('/payments/:id', LOGIN_ONLY, USER_QUERY, PaymentController.read);

api.post('/charities', ADMIN_ONLY, CharityController.create);
api.post('/triggers', LOGIN_ONLY, USER_QUERY, TriggerController.create);
api.post('/tweets', ADMIN_ONLY, TweetController.create);
api.post('/donations', ADMIN_ONLY, DonationController.create);
api.post('/payments', ADMIN_ONLY, PaymentController.create);

api.put('/charities/:id', ADMIN_ONLY, CharityController.update);
api.put('/triggers/:id', ADMIN_ONLY, TriggerController.update);
api.put('/tweets/:id', ADMIN_ONLY, TweetController.update);
api.put('/users/:id', USER_ONLY, UserController.update);
api.put('/donations/:id', ADMIN_ONLY, DonationController.update);
api.put('/payments/:id', ADMIN_ONLY, PaymentController.update);

api.delete('/charities/:id', ADMIN_ONLY, CharityController.destroy);
api.delete('/triggers/:id', ADMIN_ONLY, TriggerController.destroy);
api.delete('/tweets/:id', ADMIN_ONLY, TweetController.destroy);
api.delete('/users/:id', USER_ONLY, UserController.destroy);
api.delete('/donations/:id', ADMIN_ONLY, DonationController.destroy);
api.delete('/payments/:id', ADMIN_ONLY, PaymentController.destroy);

api.post('/charities', ADMIN_ONLY, CharityController.create);
api.post('/triggers', ADMIN_ONLY, TriggerController.create);
api.post('/tweets', ADMIN_ONLY, TweetController.create);
api.post('/donations', ADMIN_ONLY,  DonationController.create);
api.post('/payments', ADMIN_ONLY,  PaymentController.create);

module.exports =  api;
