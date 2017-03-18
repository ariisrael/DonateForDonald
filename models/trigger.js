const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var TriggerSchema = new Schema({
  name: { type: String, unique: true, required: true, trim: true },
  keywords: { type: [String], required: true },
  normalize: Boolean,
  followers: [{ ref: 'User', type: ObjectId }],
  tweets: [{ ref: 'Tweet', type: ObjectId }],
  createdBy: { ref: 'User', type: ObjectId },
});

const Trigger = mongoose.model('Trigger', TriggerSchema);

module.exports = exports = Trigger;
