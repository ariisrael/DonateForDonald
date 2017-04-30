const models = require('../models');
const Term = models.Term;

const createLogger = require('logging').default;
const log = createLogger('controllers/terms');

module.exports = {
  index: (req, res) => {
    Term.find().select('term weight').exec((err, terms) => {
      if (err) {
        log.error(err)
        return res.json([])
      }
      if (!terms) {
        return res.json([])
      }
      res.json(terms)
    })
  }
}
