const models = require('../models');
const Tweet = models.Tweet;
const async = require('async');

const createLogger = require('logging').default;
const log = createLogger('controllers/tweets');

module.exports = {
    index: (req, res) => {
        Tweet.find({ testTweet: { $ne: true } }, (err, tweets) => {
            if(err) return log.error(err);
            res.json(tweets);
        });
    },
    read: (req, res) => {
        Tweet.findById(req.params.id, (err, tweet) => {
            if(err) return log.error(err);
            res.json(tweet);
        });
    },
    find: (req, res) => {
      /*
        This will search tweets, ranking by how close the match is
        make sure this endpoint is rate limited,
        it might make the database unhappy if we don't
      */
      var query = res.locals.query.q
      var params = { $text : { $search : '"' + query + '""' }, testTweet: { $ne: true } }
      if (!query) {
        return res.json([])
      }
      Tweet.find(
        params
      )
      .sort({ posted: -1 })
      .limit(50)
      .exec((err, tweets) => {
        if (err) {
          log.error(err)
        }
        if (!tweets) {
          tweets = []
        }
        Tweet.count(params, (err, count) => {
          res.json({
              tweets: tweets,
              count: count
            })
        })
      })
    },
    create: (req, res) => {
        var tweet = new Tweet(req.body);
        tweet.save((err) => {
            if(err) return log.error(err);
        });
    },
    update: (req, res) => {
        var query = { _id : req.params.id };
        Tweet.update(query, req.body, {}, (err, num) => {
            if(err) return log.error(err);
            res.json(num);
        });
    },
    destroy: (req, res) => {
        Tweet.remove({ _id: req.params.id }, (err) => {
            if(err) log.error(err);
            res.json()
        });
    },
    mostRecent: (req, res) => {
      res.json({
        tweet: res.locals.mostRecentTweet
      })
    }
}
