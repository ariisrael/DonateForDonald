const models = require('../models');
const Trigger = models.Trigger;

module.exports = {
    index: (req, res) => {
        var query = req.locals.query
        Trigger.find(params, (err, triggers) => {
            if(err) return console.error(err);
            res.json(triggers);
        });
    },
    read: (req, res) => {
        var query = req.locals.query
        query.id = req.params.id
        Trigger.findOne(params, (err, trigger) => {
            if(err) return console.error(err);
            res.json(trigger);
        });
    },
    create: (req, res) => {
        var trigger = new Trigger(req.body);
        trigger.userId = req.user.id
        trigger.save((err) => {
            if(err) return console.error(err);
        });
    },
    update: (req, res) => {
        var query = req.locals.query
        query.id = req.params.id
        Trigger.findOne({
          id: req.params.id,
          userId: req.user.id
        }, (err, trigger) => {
            if (trigger) {
              for(key in req.body) {
                trigger[key] = req.body[key]
              }
            } else {
              var trigger = new Trigger(req.body);
            }
            trigger.userId = req.user.id
            trigger.save((err) => {
              if(err) return console.error(err);
            });
        });
    },
    destroy: (req, res) => {
        findByIdAndRemove(req.params.id, (err, trigger) => {
            if(err) return console.error(err);
            res.json(trigger);
        });
    }
}
