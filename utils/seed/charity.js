if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const models = require('../../models')
const Charity = models.Charity;

const config = require('../../config/worker')
const db = config.db

const charities = require('./data/charities')

db.once('open', function() {
  charities.forEach((charity) => {
    Charity.findOne({ _id: charity.ein }, (err, c) => {
      if (c) {
        return console.log('found: ', c)
      }
      if (err) {
        return console.error('error: ', err)
      }
      var c = new Charity({
        _id: charity.ein,
        twitter: charity.twitter,
        name: charity.name
      })
      c.save((err) => {
        console.log(err)
      })
    })
  })
})
