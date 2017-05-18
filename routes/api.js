const express = require('express');

const app = require('../app');
const controllers = require('../controllers');
const middleware = require('./utilMiddleware')

const TriggerController = controllers.triggers;
const UserController = controllers.users;
const DonationController = controllers.donations;
const TweetController = controllers.tweets;
const CharityController = controllers.charities;
const PaymentController = controllers.payments;
const TermsController = controllers.terms;
const SocialController = controllers.social;

const ADMIN_ONLY = UserController.ensureAdmin;
const USER_ONLY = UserController.ensureAuthorized;
const LOGIN_ONLY = UserController.ensureAuthenticated;
const USER_QUERY = UserController.userQuery
const returnJSON = middleware.returnJSON

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
api.get('/tweets/most-recent', TweetController.mostRecent);
api.get('/tweets/:id', TweetController.read);

api.post('/triggers', LOGIN_ONLY, USER_QUERY, TriggerController.create);
api.post('/triggers/session', TriggerController.storeInSession);
api.post('/tweets', ADMIN_ONLY, TweetController.create);

api.post('/social/enable', LOGIN_ONLY, SocialController.enableUser)
api.post('/social/disable', LOGIN_ONLY, SocialController.disableUser)
api.post('/social/enable/:id', LOGIN_ONLY, SocialController.enableTrigger)
api.post('/social/disable/:id', LOGIN_ONLY, SocialController.disableTrigger)

api.put('/triggers/:id', LOGIN_ONLY, TriggerController.update);
api.put('/users/card/:id', USER_ONLY, UserController.updatePayment);
api.put('/users/:id', USER_ONLY, returnJSON, UserController.accountPut);

api.post('/resend-confirmation-email', LOGIN_ONLY, UserController.sendConfirmationEmail)

api.delete('/triggers/:id', LOGIN_ONLY, TriggerController.destroy);

api.use((req, res, next) => {
  res.status(404)
  res.json({error: "Not Found"})
})

module.exports =  api;
