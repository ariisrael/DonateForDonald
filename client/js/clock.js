function getTimeSince(starttime) {
  var t = Date.parse(new Date()) - Date.parse(starttime);
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

var timeinterval;

function initializeClock(id) {

  var lastTweet = $('#last-tweet-time')
  var starttime = new Date(lastTweet.data('last-time'))

  var clock = document.getElementById(id);
  var classList = []
  clock.classList.forEach(function(className) {
    if (className != 'hide') {
      classList.push(className)
    }
  })
  clock.classList = classList
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeSince(starttime);
    var daysInHours = (t.days * 24);
    var hoursNew = '0' + (t.hours + daysInHours);
    hoursSpan.innerHTML = (hoursNew).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  function queryForMostRecent() {
    jQuery.get('/api/tweets/most-recent', function(data, textStatus, jqxhr) {

      starttime = new Date(data.tweet.posted)

    })
  }

  updateClock();
  timeinterval = setInterval(updateClock, 1000);
  setInterval(queryForMostRecent, 120000);
}

initializeClock('clockdiv');
