const mongoose = require('../config/mongo');
var crypto = require('crypto')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DonationSchema = new Schema({
  userId: ObjectId,
  triggerId: { type: ObjectId, ref: 'Trigger'},
  charityId: { type: String, ref: 'Charity'},
  amount: { type: Number, min: 0, required: true },
  tweetId: { type: String, ref: 'Tweet' },
  paid: { type: Boolean, default: false },
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;
