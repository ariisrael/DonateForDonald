var rabbit_url = process.env.CLOUDAMQP_URL || 'amqp://localhost'

const createLogger = require('logging').default;
const log = createLogger('rabbit');

var connection = amqp.createConnection({ host: 'dev.rabbitmq.com' });

// add this for better debuging
connection.on('error', function(e) {
  log.error("Error from amqp: ", e);
});

module.exports = connection
