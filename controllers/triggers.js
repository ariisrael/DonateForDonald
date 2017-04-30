const models = require('../models');
const Trigger = models.Trigger;
const Charity = models.Charity;

const createLogger = require('logging').default;
const log = createLogger('controllers/triggers');

module.exports = {
    index: (req, res) => {
        var query = req.locals.query
        Trigger.find(params, (err, triggers) => {
            if (err)
                return log.error(err);
            res.json(triggers);
        });
    },
    read: (req, res) => {
        var query = req.locals.query
        query.id = req.params.id
        Trigger.findOne(params, (err, trigger) => {
            if (err)
                return log.error(err);
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
                log.error(err);
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
                      continue;
                    }
                    if (key === 'name' || key === 'userId') {
                      continue;
                    }
                    trigger[key] = req.body[key]
                }
            } else {
                return res.json({})
            }
            trigger.userId = req.user.id
            trigger.save((err) => {
                var response = {
                    trigger: {
                      _id: trigger._id,
                      name: trigger.name,
                      charityId: trigger.charityId,
                      userId: trigger.userId,
                      amount: trigger.amount,
                      social: trigger.social,
                      active: trigger.active,
                    }
                }
                if (err) {
                    response.error = err
                    log.error(err);
                    res.json(response)
                }
                Charity
                  .findById(trigger.charityId)
                  .select('_id name twitter image')
                  .exec((err, charity) => {
                    if (err) {
                        response.error = err
                        log.error(err);
                        res.json(response)
                    }
                    response.charity = charity
                    res.json(response)
                  })
            });
        });
    },
    destroy: (req, res) => {
      var query = {}
      query._id = req.params.id || req.body.id
      query.userId = req.user.id
      Trigger.find(query).remove().exec((err, trigger) => {
        if (err) {
          return log.error(err);
        }
        res.json(trigger);
      })
    },
    storeInSession: (req, res) => {
      if (!req.user) {
        req.session.sessionTrigger = req.body
      }
      res.json({})
    }
}
