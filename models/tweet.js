const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var TweetSchema = new Schema({
  _id: String,
  tweetId: String,
  text: String,
  postedAt: Date,
  hashtags: [String],
  tagged: [String],
  link: String,
});

TweetSchema.index({text: 'text'});
const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = exports = Tweet;
