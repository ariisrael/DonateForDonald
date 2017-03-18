const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;

var charitySchema = new Schema({
  name: { type: String, unique: true, required: true },
  alias: [String],
  twitter: [String],
  logo: String,
  website: String,
  ein: { type: String, unique: true, required: true },
  taxDeductible: { type: Boolean, default: true }
});

const Charity = mongoose.model('Charity', charitySchema);

module.exports = exports = Charity;
