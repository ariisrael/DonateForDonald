const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;

const charitySchema = new Schema({
  _id: String,
  name: String,
  twitter: [String],
});

const Charity = mongoose.model('Charity', charitySchema);
module.exports = Charity;
