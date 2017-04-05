const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TriggerSchema = new Schema({
  name: { type: String, trim: true },
  charityId: String, // Charity IDs are eins
  userId: ObjectId,
  amount: { type: Number, min: 1 },
  social: Boolean,
});

const Trigger = mongoose.model('Trigger', TriggerSchema);
module.exports = Trigger;
