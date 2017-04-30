const models = require('../models');
const Donation = models.Donation;

const createLogger = require('logging').default;
const log = createLogger('controllers/donations');

module.exports = {
    index: (req, res) => {
        if(!req.user.admin) {
            log.info(req.user);
            Donation.find({ userId: req.user._id }, function(err, result) {
                log.info(result);
                if(err) return log.info(err);
                res.json(result);
            })
            log.info('not admin')
        } else {
        var query = req.locals.query;
        Donation.find({}, (err, donations) => {
            if(err) return log.error(err);
            res.json(donations);
        });
        }

    },
    update: (req, res) => {
        var query = req.locals.query;
        query.id = req.params.id
        Donation.update(query, req.body, {}, (err, num) => {
            if(err) return log.error(err);
            res.json(num);
        });
    },
    read: (req, res) => {
        var query = req.locals.query;
        query.id = req.params.id
        Donation.findOne(query, (err, user) => {
            if(err) return log.error(err);
            res.json(user);
        });
    },
    destroy: (req, res) => {
        Donation.remove({ _id: req.params.id }, (err) => {
            if(err) return log.error(err);
        });
    },
    create: (req, res) => {
        var donation = new Donation(req.body);
        donation.save((err) => {
            if(err) return log.error(err);
        });
    }
}
