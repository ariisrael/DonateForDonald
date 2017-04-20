const models = require('../models');
const Trigger = models.Trigger;
const User = models.User;

exports.enableTrigger = function(req, res) {
  Trigger.findOne({
    userId: req.user.id,
    _id: req.params.id
  }, (err, trigger) => {
    if (err) {
      return res.json({error: err})
    }
    trigger.social = true
    trigger.save((err) => {
      res.json({
        trigger: trigger,
        error: err
      })
    })
  })
}

exports.disableTrigger = function(req, res) {
  Trigger.findOne({
    userId: req.user.id,
    _id: req.params.id
  }, (err, trigger) => {
    if (err) {
      return res.json({error: err})
    }
    trigger.social = false
    trigger.save((err) => {
      res.json({
        trigger: trigger,
        error: err
      })
    })
  })
}

exports.enableUser = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return res.json({error: err})
    }
    user.social = true
    user.skipSocial = true
    user.save((err) => {
      if (err) {
        return res.json({error: err})
      }
      Trigger.update({userId: user.id}, {social: true}, {multi: true}, (err, doc) => {
        if (err) {
          return res.json({error: err})
        }
        return res.json({})
      })
    })
  })
}

exports.disableUser = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return res.json({error: err})
    }
    user.social = false
    user.skipSocial = true
    user.save((err) => {
      if (err) {
        return res.json({error: err})
      }
      Trigger.update({userId: user.id}, {social: false}, {multi: true}, (err, doc) => {
        if (err) {
          return res.json({error: err})
        }
        return res.json({})
      })
    })
  })
}
