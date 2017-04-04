var Twitter = require('twitter')

if (process.env.NODE_ENV !== 'production' && !process.env.TWITTER_CONSUMER_KEY) {
  // Twitter app credentials for @DonateForDonald
  var twitterAPICredentials = {
    consumer_key:'wNNSmSwpnumnvVW6qOWwaFHW5',
    consumer_secret: 'VlCPlSP3DL6okBhUNvA0oKknNWFQMGRm7SOBVpAvAERgETXFCt',
    access_token: '18880271-CoGsLW04GUOVVs4YHfN0mUKimwLRF1g2GGeDx8eD7',
    access_token_secret:  'OQIoOLmJKqrungjHyLkBZNlSG0anYGuxIeDS9zPYGweyY',
  }
} else {
  var twitterAPICredentials = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
}

var twitterClient = new Twitter(twitterAPICredentials)

module.exports = {
  twitter: twitterClient,
  consumerKey: twitterAPICredentials.consumer_key,
  consumerSecret: twitterAPICredentials.consumer_secret,
  access_token_key: twitterAPICredentials.access_token_key,
  access_token_secret: twitterAPICredentials.access_token_secret
}
