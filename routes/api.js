const express = require('express');

const app = require('../index');
const controllers = require('../controllers');

const TriggerController = controllers.triggers;
const UserController = controllers.users;
const DonationController = controllers.donations;
const TweetController = controllers.tweets;
const CharityController = controllers.charities;

const ADMIN_ONLY = UserController.ensureAdmin;
const USER_ONLY = UserController.ensureAuthorized;
const LOGIN_ONLY = UserController.ensureAuthenticated;

var api = express.Router();

api.get('/triggers', TriggerController.index);
api.get('/users', ADMIN_ONLY, UserController.index);
api.get('/charities', CharityController.index);
api.get('/tweets', TweetController.index);
api.get('/donations', ADMIN_ONLY, DonationController.index);

api.get('/triggers/:id', TriggerController.read);
api.get('/users/:id', USER_ONLY, UserController.read);
api.get('/charities/:id', CharityController.read);
api.get('/tweets/:id', TweetController.read);
api.get('/donations/:id', ADMIN_ONLY, DonationController.read);

api.post('/charities', ADMIN_ONLY, CharityController.create);
api.post('/triggers', LOGIN_ONLY, TriggerController.create);
api.post('/tweets', ADMIN_ONLY, TweetController.create);
api.post('/donations', ADMIN_ONLY, DonationController.create);

api.put('/charities/:id', ADMIN_ONLY, CharityController.update);
api.put('/triggers/:id', ADMIN_ONLY, TriggerController.update);
api.put('/tweets/:id', ADMIN_ONLY, TweetController.update);
api.put('/users/:id', USER_ONLY, UserController.update);
api.put('/donations/:id', ADMIN_ONLY, DonationController.update);

api.delete('/charities/:id', ADMIN_ONLY, CharityController.destroy);
api.delete('/triggers/:id', ADMIN_ONLY, TriggerController.destroy);
api.delete('/tweets/:id', ADMIN_ONLY, TweetController.destroy);
api.delete('/users/:id', USER_ONLY, UserController.destroy);
api.delete('/donations/:id', ADMIN_ONLY, DonationController.destroy);

api.post('/charities', ADMIN_ONLY, CharityController.create);
api.post('/triggers', ADMIN_ONLY, TriggerController.create);
api.post('/tweets', ADMIN_ONLY, TweetController.create);
api.post('/donations', ADMIN_ONLY,  DonationController.create);

api.get('/users/:id/triggers', USER_ONLY, UserController.triggers.index);
api.post('/users/:id/triggers', USER_ONLY, UserController.triggers.create);

api.get('/users/:userId/triggers/:triggerId', USER_ONLY, UserController.triggers.read);
api.put('/users/:userId/triggers/:triggerId', USER_ONLY, UserController.triggers.update);
api.delete('/users/:userId/triggers/:triggerId', USER_ONLY, UserController.triggers.destroy);

module.exports = exports = api;