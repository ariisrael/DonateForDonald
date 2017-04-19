$(document).ready(function () {
  var rawTrigger = localStorage.getItem('trigger');
  if (rawTrigger) {
    var userTrigger = JSON.parse(rawTrigger);
    $('.js-charity-handles').text(userTrigger.twitter);
    $('.js-trigger-name').text(userTrigger.triggerName);
    var urlTrigger = userTrigger.triggerName.replace(' ', '+');
    var urlCharity = userTrigger.charityId.replace('-', '');
    var linkTrigger =  'http://www.donatefordonald.org/trigger=' + urlTrigger + '&charity=' + urlCharity;
    $('.js-landing-link').prop('href', linkTrigger).text(linkTrigger);
    delete userTrigger.charityName;
    delete userTrigger.triggerName;
    delete userTrigger.twitter;
  }
  var redirectUrl = "/auth/twitter/callback";
  if (user && user.twitter) {
    redirectUrl = "/triggers";
  }

  console.log(userTrigger);
  $('.connect-twitter').on('click', function (event) {
    event.preventDefault();
    if (userTrigger) {
      userTrigger.social = true;
      jQuery.ajax({
        type: 'post',
        url: '/api/triggers',
        data: userTrigger,
        success: function () {
          localStorage.clear();
          window.location = redirectUrl;
        },
        dataType: 'json'
      });
    } else {
      window.location = '/triggers'
    }
  });

  $('.skip-link').on('click', function (event) {
    event.preventDefault();
    if (userTrigger) {
      jQuery.ajax({
        type: 'post',
        url: '/api/triggers',
        data: userTrigger,
        success: function () {
          localStorage.clear();
          window.location = "/triggers";
        },
        dataType: 'json'
      });
    } else {
      window.location = "/triggers";
    }
  });
});
