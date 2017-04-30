const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const createLogger = require('logging').default;
const log = createLogger('mongo');

mongoose.connect(process.env.MONGODB_URI);
mongoose.plugin(timestamps);

mongoose.connection.on('error', (err) => {
  log.error('connection error: ', err)
})

module.exports = exports = mongoose;
