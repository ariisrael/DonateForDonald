var config = require('../config/worker')
var models = require('../models')
var _ = require('lodash')
var User = models.User
var Trigger = models.Trigger
var Tweet = models.Tweet
var Donation = models.Donation

var payment = require('../utils/payment')

var workerEmitter = config.workerEmitter

workerEmitter.on('finishedMakingDonations', () => {
  
})

workerEmitter.on('donationsMade', () => {

})

function makeDonations() {
  Donation.
    find({made: false}).
    populate('user tweet trigger').
    exec((err, donations) => {
      if (err || !donations.length) {
        if (err) console.log('error finding donations', err)
        return workerEmitter.emit('finishedMakingDonations')
      }

      for (var i = 0; i++; i < donations.length) {
        var donation = donations[i]
        var trigger = donation.trigger
        var user = donation.user
        var tweet = donation.tweet

        // code to actually charge customer goes here
        // then save the donation as actually having been made

      }
    })
}
