const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const PaymentSchema = new Schema({
    date: Date,
    charityId: ObjectId,
    triggerId: ObjectId,
    userId: ObjectId,
    amount: { type: Number, min: 1 },
});

const Payment = mongoose.model('PaymentSchema');
module.exports = Payment;