if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var config = require('../config/worker')

var Trigger = require('../models/trigger')
var Charity = require('../models/charity')
var db = config.db
var getAndSaveTweets = require('../workers/saveTweets')
var analyzeTweets = require('../workers/analyzeTweets').analyzeTweets

var done = 0;
var triggersDone = 0;

var trigs = [{
    name: 'maga',
    words: ['maga', 'MAGA', 'Make America Great Again']
  }, {
    name: 'insults',
    words: ['failing']
  }, {
    name: 'fake news',
    words: ['FAKE NEWS', 'fake news', 'lying media', 'nytimes']
  }, {
    name: 'sad',
    words: ['SAD']
  }, {
    name: '',
    words: ['']
  }]

config.workerEmitter.on('scheduleTweetGrabbing', () =>{
  process.exit()
})

config.workerEmitter.on('tweetSavingDone', () => {
  done++;
  if (done == 2) {
    analyzeTweets()
  }
})

config.workerEmitter.on('triggerSaved', (newTrigger) => {
  triggersDone++;
  if (triggersDone == trigs.length) {
    config.workerEmitter.emit('triggerSavingDone')
  }
})

config.workerEmitter.on('triggerSavingDone', () => {
  done++;
  if (done == 2) {
    analyzeTweets()
  }
})

function seed() {
  db.once('open', function() {
    for (var i = 0; i < trigs.length; i++) {
      saveTrigger(trigs[i])
    }
    getAndSaveTweets()
  })
}

function saveTrigger(t) {
  Trigger.findOne({name: t.name}, (err, trigger) => {
    if (!trigger) {
      var newTrigger = new Trigger(t)
      newTrigger.save(function(err) {
        if (err) {
          console.log(t.name, err)
        }
        config.workerEmitter.emit('triggerSaved', newTrigger)
      })
    } else {
      config.workerEmitter.emit('triggerSaved', trigger)
    }
  })
}

seed()
