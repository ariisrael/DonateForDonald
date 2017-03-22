const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TriggerSchema = new Schema({
  name: { type: String, unique: true, trim: true, },
  keywords: { type: [String], required: true, },
  followers: [ObjectId],
});

TriggerSchema.index({ '$**': 'text' });
const Trigger = mongoose.model('Trigger', TriggerSchema);
module.exports = Trigger;
