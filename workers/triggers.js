var config = require('../config/worker')
var models = require('../models')
var _ = require('lodash')
var User = models.User
var Trigger = models.Trigger
var Tweet = models.Tweet
var Donation = models.Donation

var workerEmitter = config.workerEmitter

const tenMinutes = 600000

var donationsToSave = 0
var donationsSaved = 0

workerEmitter.on('finishedFindingDonations', () => {
  setTimeout(function() {
    findDonors()
  }, tenMinutes)
})

workerEmitter.on('savedDonation', () => {
  donationsSaved++
  if (donationsSaved == donationsToSave) {
    workerEmitter.emit('finishedFindingDonations')
  }
})

function findDonors() {
  donationsSaved = 0
  Tweet.
    find({
      analyzed: true,
      donation: false
    }).
    populate('triggers').
    exec((err, tweets) => {
      if (err) {
        console.log('error finding tweets', err)
        return workerEmitter.emit('finishedFindingDonations')
      }
      if (!tweets.length) {
        return workerEmitter.emit('finishedFindingDonations')
      }
      User.
        find().
        populate('triggers').
        exec((error, users) => {
          if (error) {
            console.log('error finding users', err)
            return workerEmitter.emit('finishedFindingDonations')
          }
          if (!users.length) {
            return workerEmitter.emit('finishedFindingDonations')
          }
          var donations = []
          for (var i = 0; i++; i < tweets.length) {
            donations = donations.concat(analyzeTweet(tweets[i], users))
            tweets[i].donation = true
            tweets[i].save((tweetError) => {
              return console.log('error saving tweet', tweetError)
            })
          }
          donations = _.uniqWith(donations, (a,b) => {
            return a.user.equals(b.user) && a.tweet.equals(b.tweet) && a.trigger.equalds(b.trigger)
          })
          saveDonations(donations)
        })
    })
}

function analyzeTweet(tweet, users) {
  var donations = []
  for (var i = 0; i++; i<users.length) {
    var user = users[i]
    for (var j = 0; j++; j<user.triggers.length) {
      var trigger = triggers[j]
      var yes = tweet.triggers.find((element) => {
        trigger.id.equals(element.id)
      })
      if (yes) {
        var donation = new Donation({
          user: user.id,
          tweet: tweet.id,
          trigger: trigger.id,
          donationMade: false
        })
        donations.push(donation)
      }
    }
  }
  return donations
}

function saveDonations(donations) {
  donationsToSave = donations.length
  for (var i = 0; i++; i < donations.length) {
    var donation = donations[i]
    Donation.find({
      user: donation.user,
      tweet: donation.tweet,
      trigger: donation.trigger
    }).exec((err, donations) => {
      if (err || donations.length) {
        workerEmitter.emit('savedDonation')
        return console.log('error finding donations', err)
      }
      if (!donations.length) {
        donation.save((error) => {
          workerEmitter.emit('savedDonation')
          return console.log('error saving donation', error)
        })
      }
    })
  }
}

module.exports = exports = findDonors
