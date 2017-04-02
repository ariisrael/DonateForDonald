var _ = require('lodash')
var popularTerms = require('../utils/popular')
var PopularTerm = require('../models/popularTerm')

function findPopularTerms(options, cb) {
  if (!cb) cb = function(){}
  var opts = {count: 1000}
  var options = _.merge(opts, options)
  popularTerms(options, function(err, terms) {
    if (err) {
      return cb(err)
    }
    if (terms) {
      terms.forEach((t, index) => {
        var query = {}
        if (t.constructor === String) {
          query.term = t
        } else {
          query.term = t.term
        }
        console.log(query)
        PopularTerm.findOne(query, function(err, term) {
          if (err) {
            console.error(err)
          }
          if (!term) {
            console.log(t)
            if (t.constructor === String) {
              term = new PopularTerm({term: t})
            } else {
              term = new PopularTerm(t)
            }
          } else {
            if (t instanceof Object) {
              term.weight = t.weight
            } else {
              term.weight = index;
            }
          }
          term.save((err, term) => {
            if (err) {
              console.error(err)
            }
          })
        })
      })
      return cb(err)
    }
  })
}

module.exports = findPopularTerms
