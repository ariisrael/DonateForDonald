const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var DonationSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true }, 
  triggerId: { type: ObjectId, ref: 'Trigger', required: true },
  amount: { type: Number, min: 0, required: true }, 
  tweetId: { type: ObjectId, ref: 'Tweet' },
  status: { type: String, enum: ['Pending', 'Complete'], default: 'Pending', required: true }
});

const Donation = mongoose.model('Donation', DonationSchema);

module.exports = exports = Donation;
