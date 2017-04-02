const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;

const charitySchema = new Schema({
  _id: String, // this is an ein
  name: String,
  twitter: [String],
});

const Charity = mongoose.model('Charity', charitySchema);
module.exports = Charity;
