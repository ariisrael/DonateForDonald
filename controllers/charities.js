const models = require('../models');
const Charity = models.Charity;

module.exports = {
    index: (req, res) => {
        Charity.find({}, (err, charities) => {
            if(err) return console.error(err);
            res.json(charities);
        });
    },
    read: (req, res) => {
        Charity.findById(req.params.id, (err, charity) => {
            if(err) return console.error(err);
            res.json(charity);
        });
    },
    create: (req, res) => {
        var charity = new Charity(req.body);
        charity.save((err) => {
            if(err) return console.error(err);
        });
    },
    update: (req, res) => {
        var query = { _id: req.params.id };
        Charity.update(query, req.body, {}, (err, num) => {
            if(err) return console.error(err);
            res.json(num);
        });
    },
    destroy: (req, res) => {
        Charity.remove(req.params.id, (err) => {
            if(err) return console.error(err);
        });
    }
}
