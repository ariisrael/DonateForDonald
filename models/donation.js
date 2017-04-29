const mongoose = require('../config/mongo');
var crypto = require('crypto')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DonationSchema = new Schema({
  userId: ObjectId,
  triggerId: { type: ObjectId, ref: 'Trigger'},
  charityId: { type: String, ref: 'Charity'},
  uniqueness: {
    type: String,
    unique: true
  },
  amount: { type: Number, min: 0, required: true },
  tweetId: { type: String, ref: 'Tweet' },
  paid: { type: Boolean, default: false },
});

DonationSchema.pre('validate', function(next) {
  // Each user should only donate once for each tweet
  // So, there's a unique: true on uniqueness, which is the hash of the userId and tweetId
  var uniqueness = this.userId + this.tweetId;
  this.uniqueness = crypto.createHash('md5').update(uniqueness).digest('hex')
  next()
})

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;
