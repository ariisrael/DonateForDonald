const mongoose = require('../config/mongo');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PopularTermSchema = new Schema({
  term: String,
  weight: Number
});

const PopularTerm = mongoose.model('PopularTerm', PopularTermSchema);

module.exports = PopularTerm;
