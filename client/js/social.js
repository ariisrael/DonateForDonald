$(document).ready(function() {
  if (!$('.social-page').length) {
    return;
  }

  var rawTrigger = localStorage.getItem('trigger');
  if (rawTrigger) {
    var userTrigger = JSON.parse(rawTrigger);
    setupSocial(userTrigger.twitter, userTrigger.charityId, userTrigger.triggerName)
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
        success: function (data) {
          localStorage.clear();
          if ($('.js-no-never input[name="donotask"]')[0].checked) {
            jQuery.ajax({
              type: 'post',
              url: '/api/social/enable'
            })
            .done(function() {
              window.location.replace(redirectUrl);
            })
          } else {
            window.location.replace(redirectUrl);
          }
        },
        dataType: 'json'
      });
    } else {
      window.location.replace('/triggers')
    }
  });

  $('.skip-link').on('click', function (event) {
    event.preventDefault();
    if (userTrigger) {
      jQuery.ajax({
        type: 'post',
        url: '/api/triggers',
        data: userTrigger,
        success: function (data) {
          localStorage.clear();
          if ($('.js-no-never input[name="donotask"]')[0].checked) {
            jQuery.ajax({
              type: 'post',
              url: '/api/social/disable'
            })
            .done(function() {
              window.location.replace("/triggers");
            })
          } else {
            window.location.replace("/triggers");
          }
        },
        dataType: 'json'
      });
    } else {
      window.location.replace("/triggers");
    }
  });
})
