const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

mongoose.connect(process.env.MONGODB_URI);
mongoose.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = exports = mongoose;
