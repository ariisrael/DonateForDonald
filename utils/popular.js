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
  'morning'
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
        words.push(d.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ''));
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
          if(!(ws.length > 1 && i === 0) && users[word]) {
            output += ("@" + users[word].name);
          } else if (hashtags[w]) {
            output += ("#" + hashtags[word].name);
          } else {
            output += cap[word] || word;
          }
          output += " ";
        });
        popularTerms.push(output.trim());
      }
    });
    callback(null, popularTerms)
  });
}

module.exports = getPopularTerms;
