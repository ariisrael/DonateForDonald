const keyword = require('./gramophone');
const Twit = require('twit');

var T = new Twit({
  consumer_key:         'HSjDtq7x7IjkrcHzEbyMT8QvN',
  consumer_secret:      'V3ewc1zexgaY8A37pDZaLLT0zJ51VZpBsnUAmnfOWcf1zv694y',
  access_token:         '18880271-oMmdZ5mxjYe8PKnoEYe4j1FyDz6Wu4YoYOvHh5h8O',
  access_token_secret:  'uVeE5gM4z7i0L7HMLxndcUyyfzsNCbwluqJmEIv9cM7AU'
});
var words = [];
var users = {};
var hashtags = {};
var cap = {};


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
function getPopularTerms(callback) {
  T.get('statuses/user_timeline', { screen_name: 'realDonaldTrump', count: 200, tweet_mode: 'extended' }, function(err, data, response) {
    if(err) {
      callback(err, null);
    }
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
    words = keyword.extract(words.join(' '), {limit: 100});
    var popularTerms = [];
    words.forEach((w, index) => {
      if(!(blacklist.indexOf(w.toLowerCase()) > 0)) {
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
        var outputTerm = output.replace(/gt/g, '').replace(/amp/g, '').replace(/RT/g, '').replace(/cc/g, '').trim();
        var already = false;
        popularTerms.forEach((term) => {
          if(term.indexOf(outputTerm) > 0) {
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
  });
}

getPopularTerms((err, terms) => {
  if(err) return console.log(err);
  console.log(terms);
});

module.exports = getPopularTerms;
