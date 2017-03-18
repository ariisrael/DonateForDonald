const models = require('../models');
const Trigger = models.Trigger;

module.exports = {
    index: (req, res) => {
        Trigger.find({}, (err, triggers) => {
            if(err) return console.error(err);
            res.json(triggers);
        });
    },
    read: (req, res) => {
        Trigger.findById(req.params.id, (err, trigger) => {
            if(err) return console.error(err);
            res.json(trigger);
        });
    },
    create: (req, res) => {
        var trigger = new Trigger(req.body);
        trigger.save((err) => {
            if(err) return console.error(err);
        });
    },
    update: (req, res) => {
        Trigger.findById(req.params.id, (err, trigger) => {
            for(key in req.body) {
                trigger[key] = req.body[key]
            }
            trigger.save();
        });
    },
    destroy: (req, res) => {
        findByIdAndRemove(req.params.id, (err, trigger) => {
            if(err) return console.error(err);
            res.json(trigger);
        });
    }
}