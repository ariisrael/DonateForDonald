const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

mongoose.connect(process.env.MONGODB_URI);
mongoose.plugin(timestamps);

module.exports = exports = mongoose;
