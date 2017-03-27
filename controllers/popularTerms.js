const models = require('../models');
const Payment = models.PopularTerm;

module.exports = {
  index: (req, res) => {
    popularTerms.find({}, 'term', (err, terms) => {
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
