const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const TransactionSchema = new Schema({
    date: Date,
    charityId:  ObjectId, 
    userId: ObjectId,
    amount: Number,
    status: { type: String, enum: [ 'Pending', 'Paid' ]}, 
});

const Transaction = mongoose.model('TransactionSchema');

module.exports = Transaction;