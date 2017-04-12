const models = require('../models');
const Trigger = models.Trigger;

module.exports = {
    index: (req, res) => {
        var query = req.locals.query
        Trigger.find(params, (err, triggers) => {
            if (err)
                return console.error(err);
            res.json(triggers);
        });
    },
    read: (req, res) => {
        var query = req.locals.query
        query.id = req.params.id
        Trigger.findOne(params, (err, trigger) => {
            if (err)
                return console.error(err);
            res.json(trigger);
        });
    },
    create: (req, res) => {
        var trigger = new Trigger(req.body);
        trigger.userId = req.user.id
        trigger.save((err) => {
            var response = {
                trigger: trigger
            }
            if (err) {
                response.error = err
                console.error(err);
            }
            res.json(response)
        });
    },
    update: (req, res) => {
      var query = {}
      query._id = req.params.id || req.body.id
      query.userId = req.user.id
        Trigger.findOne(query, (err, trigger) => {
            if (trigger) {
                for (key in req.body) {
                    if (key === 'id' || key === '_id') {
                      continue
                    }
                    trigger[key] = req.body[key]
                }
            } else {
                return res.json({})
            }
            trigger.userId = req.user.id
            trigger.save((err) => {
                var response = {
                    trigger: trigger
                }
                if (err) {
                    response.error = err
                    console.error(err);
                }
                res.json(response)
            });
        });
    },
    destroy: (req, res) => {
        findByIdAndRemove(req.params.id, (err, trigger) => {
            if (err)
                return console.error(err);
            res.json(trigger);
        });
    }
}
