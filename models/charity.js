const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;

var charitySchema = new Schema({
  name: String,
  twitter: [String],
  ein: String
});
const Charity = mongoose.model('Charity', charitySchema);

module.exports = exports = Charity;
