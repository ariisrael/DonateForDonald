const express = require('express');

const app = require('../app');
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

const bodyParser = require('body-parser');
// all of these should be json decoded, so load json body parser here
app.use(bodyParser.json());

var api = express.Router();

api.get('/triggers', LOGIN_ONLY, USER_QUERY, TriggerController.index);
api.get('/users', ADMIN_ONLY, UserController.index);
api.get('/tweets', TweetController.index);
api.get('/terms', TermsController.index)

api.get('/tweets/search', TweetController.find);
api.get('/triggers/:id', TriggerController.read);
api.get('/users/:id', USER_ONLY, USER_QUERY, UserController.read);
api.get('/tweets/:id', TweetController.read);

api.post('/triggers', LOGIN_ONLY, USER_QUERY, TriggerController.create);
api.post('/tweets', ADMIN_ONLY, TweetController.create);

api.put('/triggers/:id', USER_ONLY, TriggerController.update);
api.put('/users/:id', USER_ONLY, UserController.update);

api.delete('/triggers/:id', USER_ONLY, TriggerController.update);

module.exports =  api;
