$(document).ready(function () {
  var rawTrigger = localStorage.getItem('trigger');
  if(rawTrigger) {
    var userTrigger = JSON.parse(rawTrigger);
    $('.js-charity-label span').text(userTrigger.charityName);
    $('.js-trigger-label span').text(userTrigger.triggerName);
  }
  var redirectUrl = "/auth/twitter/callback";
  if(user && user.twitter) {
    redirectUrl = "/triggers";
  }

  $('.connect-twitter').on('click', function (event) {
    event.preventDefault();
    var rawTrigger = localStorage.getItem('trigger');
    if(rawTrigger) {
      var userTrigger = JSON.parse(rawTrigger);
      delete userTrigger.charityName;
      delete userTrigger.triggerName;

      userTrigger.social = true;
      jQuery.ajax({
        type: 'post',
        url: '/api/triggers',
        data: userTrigger,
        success: function () {
          console.log('Trigger', userTrigger, 'stored');
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
    var rawTrigger = localStorage.getItem('trigger');
    if (rawTrigger) {
      var userTrigger = JSON.parse(rawTrigger);
      delete userTrigger.charityName;
      delete userTrigger.triggerName;

      jQuery.ajax({
        type: 'post',
        url: '/api/triggers',
        data: userTrigger,
        success: function () {
          console.log('Trigger', userTrigger, 'stored');
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
