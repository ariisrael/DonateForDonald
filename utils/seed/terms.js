var faker = require('faker')
var async = require('async')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const testPassword = 'iamdonatingfordonaldwhyarentyouloser'
const ACLU = '13-3871360'

const models = require('../../models')
const User = models.User
const Trigger = models.Trigger
const Term = models.Term

const config = require('../../config/worker')
const db = config.db

const terms = require('./data/popularTerms')

db.once('open', function() {
  async.each(terms, (term, done) => {
    Term.findOne({term: term}, (err, t) => {
      if (!t) {
        Term.create({
          term: term
        }, (err) => {
          if (err) console.log(err)
          done()
        })
      } else {
        done()
      }
    })
  }, (err) => {
    console.log('done')
    process.exit(0)
  })

})
