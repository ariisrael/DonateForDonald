const createLogger = require('logging').default;
const log = createLogger('setupStream');
const config = require('../config/worker'); // Credentials

const Twitter = require('twit'); // Twitter API
const TRUMP_USER_ID = '25073877'; // User ID for @realDonaldTrump
const GOP_CLUSTER_FUCK_ID = '3388526333'; // User ID for @GOPClusterFuck


function setupStream(analyzeStream) {
  // Create new stream filtering statuses by user (including retweets, replies)
  const T = new Twitter(config.twitterCreds);
  var stream = T.stream('statuses/filter', { follow: [TRUMP_USER_ID, GOP_CLUSTER_FUCK_ID] });

  // TODO: implement backoff reconnection logic
  stream.on('disconnect', function (disconnectMessage) {
    log.warn('disconnected: ', disconnectMessage)
    stream.stop().start()
  })

  stream.on('error', function (error) {
    log.error('errored: ', JSON.stringify(error))
    // this is synchronous, no need to have a callback,
    // but it returns this so the functions can be chained.
    stream.stop().start()
  })

  return stream;
}

module.exports = setupStream
