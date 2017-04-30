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

db.once('open', function() {
  seedUsers()
})

function seedUsers() {
  var array = []
  for (var i = 0; i < 100; i++) {
    array.push(i)
  }
  var users = []

  async.eachSeries(array, function(item, next) {
    var name = faker.name.findName();
    var email = faker.internet.email();
    var user = new User({
      name: name,
      email: email,
      password: testPassword,
      emailConfirmed: true,
      testUser: true
    })

    if (item % 2 == 0) {
      user.monthlyLimit = 100
    }

    user.save((err) => {
      if (err) {
        console.log("error: ", err)
      } else {
        users.push(user)
      }
      next()
    })
  }, (err, result) => {
    console.log('saved all users')
    testTriggers(users)
  })
}

function testTriggers(users) {
  Term
    .find()
    .limit(100)
    .exec((err, terms) => {
      if (err) {
        return console.log(err)
      } else {
        async.eachSeries(users, function(user, nextUser) {
          async.eachSeries(terms, function(term, nextTerm) {
            var trigger = new Trigger({
              charityId: ACLU,
              userId: user.id,
              amount: 1,
              name: term.term
            })
            trigger.save((err) => {
              if (err) {
                console.log(err)
              }
              nextTerm()
            })
          }, (err, result) => {
            console.log('saved terms for user: ', user.name)
            var fakeTerms = ['test', 'jobs']
            async.eachSeries(fakeTerms, function(term, nextTerm) {
              var trigger = new Trigger({
                charityId: ACLU,
                userId: user.id,
                amount: 1,
                name: term
              })
              trigger.save((err) => {
                if (err) {
                  console.log(err)
                }
                nextTerm()
              })
            }, (err, result) => {
              nextUser()
            })
          })
        }, (err, result) => {
          console.log('finished')
        })
      }
    })
}
