const config = require('../config/worker')
const Twitter = require('twit')

const createLogger = require('logging').default;
const log = createLogger('worker');

function tweetAtTrump(user, tweet, charity, trigger, callback) {
  if (user.twitter && user.twitterCreds) {
    if (user.twitterCreds.accessToken && user.twitterCreds.accessTokenSecret) {
      var userTwitterCreds = {
        consumer_key: config.twitterCreds.consumer_key,
        consumer_secret: config.twitterCreds.consumer_secret,
        access_token: user.twitterCreds.accessToken,
        access_token_key: user.twitterCreds.accessToken,
        access_token_secret: user.twitterCreds.accessTokenSecret,
      }
      var T = new Twitter(userTwitterCreds)
      var status = mkStatus(charity, trigger);
      var replyTweet = {
        in_reply_to_status_id: tweet._id,
        status: status
      }
      T.post('statuses/update', replyTweet, function(err, data) {
        if (err) {
          log.error(
            'twitter posting failed for user, ', JSON.stringify(user),
            ' with error, ', JSON.stringify(err),
            ' with data, ', JSON.stringify(data)
          )
        }
        callback()
      })
    } else {
      log.info('user does not have accessToken and accessTokenSecret')
      callback()
    }
  } else {
    log.info('user does not have twitterCreds')
    callback()
  }
}

function mkStatus(charity, trigger) {
  var charityTwitterHandle = charity.twitter[0] ? charity.twitter[0] : charity.name;
  var queryString = `?trigger=${trigger.name}&charity=${charity._id}`;
  var shareUrl = `https://www.donatefordonald.org/${encodeURIComponent(queryString)}`;
  var status = `#DonateForDonald turned this @realDonaldTrump tweet into $${trigger.amount} for @${charityTwitterHandle}! ${shareUrl}`
  log.info(`created tweet: ${status}`);
  return status;
}

module.exports = tweetAtTrump
