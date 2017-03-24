const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PaymentSchema = new Schema({
  charityId: ObjectId,
  triggerId: ObjectId,
  userId: ObjectId,
  amount: { type: Number, min: 1 },
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
