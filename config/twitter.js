var Twitter = require('twitter')

if (process.env.NODE_ENV !== 'production' && !process.env.TWITTER_CONSUMER_KEY) {
  // Twitter app credentials for @DonateForDonald
  var twitterAPICredentials = {
    consumer_key:'OO8grc53jt7Y3ytgpROcaNE1f',
    consumer_secret: 'zf4dbwtWrms9BeA8dZP3bfspFYOYnIC0MqTALmRolGKcNJgaEV',
    access_token: '812155024705015810-OyHYxP0VGSK2VJSQU2tr84ebGuH0VWU',
    access_token_secret:  'B3RoPM9OVrbua2OY8jjw9V7I6JhCtEyQhWwrvAGJFq970',
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
}
