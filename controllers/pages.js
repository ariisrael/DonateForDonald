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

exports.contact = function(req, res) {
  res.render('contact', {
    title: 'Contact',
    csrfToken: req.csrfToken()
  });
}

exports.reset = function(req, res) {
  res.render('reset', {
    title: 'Reset'
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
        response.triggers = triggers.reverse();
      }
      var id = new mongoose.Schema.ObjectId(req.user.id);
      Donation.find({ userId: id }).exec((err, other) => {
        console.log(err);
        response.donations = other;
        if(!response.donations) {
          response.donations = [];
        }
        console.log(response);
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
