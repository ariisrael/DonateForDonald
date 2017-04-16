$(document).ready(function () {
  var rawTrigger = localStorage.getItem('trigger');
  if(rawTrigger) {
    var userTrigger = JSON.parse(rawTrigger);
    $('.js-trigger-label').attr('data-content', userTrigger.name);
    $('.js-charity-label').attr('data-content', userTrigger.charityName);
    $('.js-charity-label').popup();
    $('.js-trigger-label').popup();
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
