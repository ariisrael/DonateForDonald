const models = require('../models');
const Payment = models.Payment;

module.exports = {
    index: (req, res) => {
        Payment.find({}, (err, payments) => {
            if(err) return console.error(err);
            res.json(payments);
        });
    },
    update: (req, res) => {
        var query = { _id: req.params.id };
        Payment.update(query, req.body, {}, (err, num) => {
            if(err) return console.error(err);
            res.json(num);
        });
    },
    read: (req, res) => {
        Payment.findById(req.params.id, (err, payment) => {
            if(err) return console.error(err);
            res.json(payment);
        });
    },
    destroy: (req, res) => {
        Payment.remove({ _id: req.params.id }, (err) => {
            if(err) return console.error(err);
        });
    },
    create: (req, res) => {
        var payment = new Payment(req.body);
        payment.save((err) => {
            if(err) return console.error(err);
        });
    }
}