const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const createLogger = require('logging').default;
const log = createLogger('index');

const app = require('./app')
module.exports = app

require('./app/server')
