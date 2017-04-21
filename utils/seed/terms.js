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
  terms.forEach((term) => {
    Term.create({
      term: term
    }, (err) => {
      if (err) console.log(err)
    })
  })
  console.log('done')

})
