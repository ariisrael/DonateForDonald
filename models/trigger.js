const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TriggerSchema = new Schema({
  name: { type: String, trim: true, },
  keywords: { type: [String], required: true, },
  charityId: ObjectId,
  userId: ObjectId,
  amount: { type: Number, min: 1, },
});

TriggerSchema.index({ '$**': 'text' });
const Trigger = mongoose.model('Trigger', TriggerSchema);
module.exports = Trigger;
