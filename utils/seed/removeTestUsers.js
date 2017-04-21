var faker = require('faker')
var async = require('async')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const testPassword = 'iamdonatingfordonaldwhyarentyouloser'

const models = require('../../models')
const User = models.User
const Trigger = models.Trigger
const Term = models.Term

const config = require('../../config/worker')
const db = config.db

db.once('open', function() {
  User.find({
    testUser: true
  }, (err, users) => {
    users.forEach((user) => {
      Trigger.remove({
        userId: user.id || user._id
      }, (err) => {
        if (err) console.log(err)
      })
    })

    console.log('removed all triggers')

    User.remove({
      testUser: true
    }, (err) => {
      if (err) {
        console.log("error: ", err)
      } else {
        console.log('removed!')
      }
    })
  })

})
