function getTimeSince(starttime) {
  var rightNow = moment()
  var then = moment(starttime)
  var diff = rightNow.diff(then)
  var duration = moment.duration(diff)
  return {
    'total': diff,
    'days': duration.get('days'),
    'hours': duration.get('hours'),
    'minutes': duration.get('minutes'),
    'seconds': duration.get('seconds')
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
  var hoursSpan = clock.find('.hours')[0];
  var minutesSpan = clock.find('.minutes')[0];
  var secondsSpan = clock.find('.seconds')[0];

  function updateClock() {
    var t = getTimeSince(starttime);
    var daysInHours = (t.days * 24);
    var hoursNew = (t.hours + daysInHours).toString();
    if (hoursNew.length < 2) {
      hoursNew = '0' + hoursNew
    }
    hoursSpan.innerHTML = hoursNew;
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
