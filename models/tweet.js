const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  _id: String,
  text: String,
  posted: Date,
});

TweetSchema.index({ text: 'text' });
const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;
