const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  _id: String,
  text: String,
  posted: Date,
  // tweets from accounts other than @realDonaldTrump that we use for testing the worker
  testTweet: { type: Boolean, default: false }
});

TweetSchema.index({ text: 'text' });
const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;
