const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TermSchema = new Schema({
  term: String,
  weight: Number
});

const Term = mongoose.model('Term', TermSchema);

module.exports = Term;
