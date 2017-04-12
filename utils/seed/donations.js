if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

var config = require('../../config/worker')
var db = config.db

const models = require('../../models')
const Tweet = models.Tweet
const Trigger = models.Trigger
const Donation = models.Donation
const User = models.User

db.once('open', function() {
    var date = new Date();
    var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    User.find((err, users) => {
        if (err) {
            console.log('trigger finding err', err)
        }
        Tweet.find().limit(10).exec((err, tweets) => {
            if (err) {
                console.log('trigger finding err', err)
            }
            users.forEach((user) => {
                Trigger.find({userId: user.id}).populate('charityId').exec((err, triggers) => {
                    if (err) {
                        console.log('trigger finding err', err)
                    }
                    triggers.forEach((trigger) => {
                        tweets.forEach((tweet) => {
                            var d = new Donation({
                              userId: user.id, 
                              triggerId: trigger.id,
                              amount: trigger.amount,
                              charityId: trigger.charityId.id,
                              tweetId: tweet.id
                            })
                            console.log(d)
                        })
                    })
                })
            })
        })
    })
})
