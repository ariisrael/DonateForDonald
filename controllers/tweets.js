const models = require('../models');
const Tweet = models.Tweet;
const async = require('async');

module.exports = {
    index: (req, res) => {
        Tweet.find({ testTweet: false }, (err, tweets) => {
            if(err) return console.error(err);
            res.json(tweets);
        });
    },
    read: (req, res) => {
        Tweet.findById(req.params.id, (err, tweet) => {
            if(err) return console.error(err);
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
      var params = { $text : { $search : '"' + query + '""' }, testTweet: false }
      if (!query) {
        return res.json([])
      }
      Tweet.find(
        params,
        { score : { $meta: "textScore" } }
      )
      .sort({ score : { $meta : 'textScore' } })
      .limit(50)
      .exec((err, tweets) => {
        if (err) {
          console.error(err)
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
            if(err) return console.error(err);
        });
    },
    update: (req, res) => {
        var query = { _id : req.params.id };
        Tweet.update(query, req.body, {}, (err, num) => {
            if(err) return console.error(err);
            res.json(num);
        });
    },
    destroy: (req, res) => {
        Tweet.remove({ _id: req.params.id }, (err) => {
            if(err) return console.error(err);
        });
    }
}
