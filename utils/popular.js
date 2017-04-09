const keyword = require('./gramophone');
const Twit = require('twit');
var fs = require('fs')

var T = new Twit({
  consumer_key:         'HSjDtq7x7IjkrcHzEbyMT8QvN',
  consumer_secret:      'V3ewc1zexgaY8A37pDZaLLT0zJ51VZpBsnUAmnfOWcf1zv694y',
  access_token:         '18880271-oMmdZ5mxjYe8PKnoEYe4j1FyDz6Wu4YoYOvHh5h8O',
  access_token_secret:  'uVeE5gM4z7i0L7HMLxndcUyyfzsNCbwluqJmEIv9cM7AU'
});

var blacklist = [
  'https',
  'amp',
  'rt',
  'rep',
  'year',
  'years',
  'coming',
  'time',
  'times',
  'day',
  'today',
  'days',
  'high',
  'talk',
  'rt foxandfriends',
  'america great',
  'join',
  'yesterday',
  'prime minister shinzo abe',
  'prime minister abe',
  'fake news media',
  'prime minister',
  'tonight',
  'night',
  'Trump2016',
  '7pm',
  'Convention',
  'TrumpPence16',
  'morning',
  'don',
  'll',
  've',
  'doesn',
  'people',
  'hey',
  'caign',
  'nashville tennessee',
  'president',
  'president obama',
  'ppl',
  'didn',
  'work',
  'working',
  'gt gt gt gt',
  'al',
  'couldn',
  'believes single source',
  'ms',
  'washinon',
  'http',
  'https',
  'ht'
];
function getPopularTerms(options, callback) {
  var tweets = {}
  var times = 0;

  function grabTweets(max_id) {
    var query = {
      screen_name: 'realDonaldTrump',
      count: 1000,
      tweet_mode: 'extended'
    }
    if (max_id) {
      query.max_id = max_id
    }
    T.get('statuses/user_timeline', query, function(err, data, response) {
      if (err) {
        console.log(err)
        callback(err, null)
      }
      data.forEach((tweet) => {
        tweets[tweet.id_str] = tweet
      })
      times++
      if (times < 16) {
        grabTweets(data[data.length - 1].id_str)
      } else {
        var tweetsArray = []
        Object.keys(tweets).forEach(function(id) {
          tweetsArray.push(tweets[id])
        })
        fs.writeFileSync('tweets.json', JSON.stringify(tweetsArray, null, '  '))
        analyzePopularTerms(tweetsArray, callback)
      }
    });
  }

  grabTweets()
}

function analyzePopularTerms(data, callback) {
  var words = [];
  var users = {};
  var hashtags = {};
  var cap = {};
  var popularTerms = [];

  data.forEach((d) => {
      var mentions = d.entities.user_mentions;
      mentions.forEach((m) => {
        if(users[m.screen_name.toLowerCase()]) {
          users[m.screen_name.toLowerCase()]['count'] = users[m.screen_name.toLowerCase()]['count'] + 1;
        } else {
          users[m.screen_name.toLowerCase()] = {};
          users[m.screen_name.toLowerCase()]['name'] = m.screen_name;
          users[m.screen_name.toLowerCase()]['count'] = 1;
        }
      });
      var tags = d.entities.hashtags;
      tags.forEach((h) => {
        if(hashtags[h.text.toLowerCase()]) {
          hashtags[h.text.toLowerCase()]['count'] = hashtags[h.text.toLowerCase()]['count'] + 1;
        } else {
          hashtags[h.text.toLowerCase()] = {};
          hashtags[h.text.toLowerCase()]['name'] = h.text;
          hashtags[h.text.toLowerCase()]['count'] = 1;
        }
      });
      words.push(d.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').replace('https', ''));
  });
  words.join(' ').split(' ').forEach((word) => {
    cap[word.toLowerCase()] = word;
  });
  words = keyword.extract(words.join(' '), {limit: 200});
  words.forEach((w, index) => {
    if(!(blacklist.indexOf(w.toLowerCase()) >= 0)) {
      var ws = w.split(" ");
      var output = "";
      ws.forEach((word, i) => {
        if(users[word]) {
          output += ("@" + users[word].name);
        } else if (hashtags[w]) {
          output += ("#" + hashtags[word].name);
        } else {
          output += cap[word] || word;
        }
        output += " ";
      });
      var outputTerm = output.replace(/gt /g, '').replace(/ gt/g, '').replace(/amp/g, '').replace(/RT/g, '').replace(/cc/g, '').trim();
      if (outputTerm == '#DrainTheSw') {
        outputTerm = '#DrainTheSwamp'
      }
      if (outputTerm == 'caign') {
        outputTerm = 'campaign'
      }
      var already = false;
      popularTerms.forEach((term) => {
        if(term.indexOf(outputTerm) >= 0) {
          already = true;
          return false;
        }
      });
      if(outputTerm !== '' && popularTerms.indexOf(outputTerm) < 0 && !already) {
        popularTerms.push(outputTerm);
      }
    }
  });
  callback(null, popularTerms)
}

module.exports = getPopularTerms;
