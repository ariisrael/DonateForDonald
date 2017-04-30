const dotenv = require('dotenv');

const createLogger = require('logging').default;
const log = createLogger('app/index');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = require('./app')
module.exports = app

require('./settings')
