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

  var clock = $('#' + id)
  if (!lastTweet || !clock) {
    return
  }
  clock.removeClass('hide')
  var daysSpan = clock.find('.days')[0];
  var hoursSpan = clock.find('.hours')[0];
  var minutesSpan = clock.find('.minutes')[0];
  var secondsSpan = clock.find('.seconds')[0];

  function updateClock() {
    var t = getTimeSince(starttime);
    var daysInHours = (t.days * 24);
    var hoursNew = (t.hours + daysInHours).toString();
    if (hoursNew.length < 2) {
      hoursNew = '0' + hoursNew
      hoursSpan.innerHTML = hoursNew;
    }
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
