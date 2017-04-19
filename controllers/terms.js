const models = require('../models');
const Term = models.Term;

module.exports = {
  index: (req, res) => {
    Term.find().select('term weight').exec((err, terms) => {
      if (err) {
        console.error(err)
        return res.json([])
      }
      if (!terms) {
        return res.json([])
      }
      res.json(terms)
    })
  }
}
