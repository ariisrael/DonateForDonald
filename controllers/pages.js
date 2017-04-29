/**
 * GET /
 */

const models = require('../models');
const mongoose = require('mongoose');
const Trigger = models.Trigger;
const Charity = models.Charity;
const Donation = models.Donation;


exports.landing = function(req, res) {
  res.render('landing', {
  });
};

exports.payment = function(req, res) {
  res.render('payment', {
    title: 'Payment',
    csrfToken: req.csrfToken(),
  });
}

exports.notifications = function(req, res) {
  res.render('notifications', {
    title: 'Notifications'
  });
}

exports.home = function(req, res) {
  res.render('home', {
    title: 'Home',
    csrfToken: req.csrfToken()
  });
}

exports.reset = function(req, res) {
  res.render('forgot', {
    title: 'Forgot Password'
  });
}

exports.settings = function(req, res) {
  res.render('settings', {
    title: 'Settings',
    csrfToken: req.csrfToken()
  });
}

exports.terms = function(req, res) {
  res.render('terms', {
    title: 'terms'
  });
}

exports.donations = function(req, res) {
  res.render('donations', {
    title: 'donations'
  });
}

exports.faq = function(req, res) {
  res.render('faq', {
    title: 'faq'
  });
}

exports.social = function(req, res) {
  res.render('social', {
    title: 'Social'
  });
}

exports.triggers = function(req, res) {
  var response = {
    title: 'Triggers',
    triggers: []
  }
  Trigger.find({
    userId: req.user.id
  }).populate('charityId').exec((err, triggers) => {
      if (err) {
        console.error(err);
      }
      if (triggers && triggers.length) {
        triggers = triggers.reverse();
      }
      response.triggers = {}
      triggers.forEach((trigger) => {
        trigger.donations = 0
        trigger.tweetsCount = 0

        var shareUrl = 'www.donatefordonald.org?trigger='
        shareUrl += trigger.name + '&charity='
        shareUrl += trigger.charityId._id
        var encodedShareUrl = encodeURIComponent(shareUrl)
        trigger.shareUrl = encodedShareUrl

        var twitterShareText = "Donate to " + trigger.charityId.twitter[0] + " anytime @realDonaldTrump tweets '" + trigger.name + "'! " + shareUrl
        trigger.twitterShareText = encodeURIComponent(twitterShareText)

        response.triggers[trigger._id] = trigger
      })
      Donation.aggregate([
        {
          $match: {
            userId: req.user._id
          }
        }, {
          $group: {
            _id: "$triggerId",
            amount: {
              $sum: "$amount"
            },
            count: {
              $sum: 1
            }
          }
        }
      ], (err, results) => {
        results.forEach((result) => {
          if (response.triggers[result._id]) {
            response.triggers[result._id].donations = result.amount
            response.triggers[result._id].tweetsCount = result.count
          }
        })
        res.render('triggers', response);
      })
  });
}

exports.charities = function(req, res) {
  res.render('charities', {
    title: 'Charities'
  });
}

exports.tweets = function(req, res) {
  res.render('tweets', {
    title: 'Tweets'
  })
}

exports.leaderboard = function(req, res) {
  res.render('leaderboard', {
    title: 'Leaderboard'
  })
}
