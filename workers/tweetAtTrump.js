const config = require('../config/worker')
const Twitter = require('twit')


function tweetAtTrump(user, tweet, charity, trigger) {
  if (user.twitter && user.twitterCreds) {
    if (user.twitterCreds.accessToken && user.twitterCreds.accessTokenSecret) {
      var userTwitterCreds = {
        consumer_key: config.twitterCreds.consumer_key,
        consumer_secret: config.twitterCreds.consumer_secret,
        access_token: user.twitterCreds.accessToken,
        access_token_key: user.twitterCreds.accessToken,
        access_token_secret: user.twitterCreds.accessTokenSecret,
      }
      var T = new Twitter(twitterCreds)
      var status = mkStatus(charity, trigger)
      var status = '@realDonaldTrump @DonateForDonald helped me donate to ' + charity.twitter[0] || charity.name + ' because of this tweet!'
      var replyTweet = {
        in_reply_to_status_id: tweet._id,
        status: status
      }
      T.post('statuses/update', replyTweet, function(err, data) {
        if (err) {
          console.error(
            'twitter posting failed for user, ', JSON.stringify(user),
            ' with error, ', JSON.stringify(err),
            ' with data, ', JSON.stringify(data)
          )
        }
      })
    }
  }
}

function mkStatus(charity, trigger) {
  var status = 'I donated to '
  if (charity.twitter && charity.twitter[0]) {
    status += charity.twitter[0]
  } else {
    status += charity.name
  }

  status += ' because @realDonaldTrump tweeted "' trigger.name '" again #DonateForDonald '

  var url = "http://www.donatefordonald.org/trigger=" + trigger.name + "&charity=" charity.name

  status += url
  return status
}

module.exports = tweetAtTrump
