const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var DonationSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true, }, 
  triggerId: { type: ObjectId, ref: 'Trigger', required: true, },
  amount: { type: Number, min: 0, required: true, }, 
  tweetId: { type: ObjectId, ref: 'Tweet', },
  paid: { type: Boolean, default: false, },
});

const Donation = mongoose.model('Donation', DonationSchema);

module.exports = Donation;