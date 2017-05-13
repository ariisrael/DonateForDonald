const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TriggerSchema = new Schema({
  name: { type: String, trim: true },
  charityId: { type: String, ref: 'Charity' }, // Charity IDs are eins
  userId: { type: ObjectId, ref: 'User' },
  amount: { type: Number, min: 1 },
  social: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
});

TriggerSchema.set('toJSON', { virtuals: true });

const Trigger = mongoose.model('Trigger', TriggerSchema);
module.exports = Trigger;
