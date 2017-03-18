const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var TweetSchema = new Schema({
  twitterId: { type: String, required: true },
  text: { type: String, required: true },
  postedAt: Date,
  analyzed: Boolean,
  triggers: [{ ref: 'Trigger', type: ObjectId }],
  link: String,
  meta: {
    favorites: Number,
    retweets: Number
  }
});

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = exports = Tweet;
