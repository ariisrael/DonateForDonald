$(document).ready(function () {
  // User toggles maximum monthly donation
  $(".js-maximum-toggle")
    .on('click', function () {
      $('.js-maximum-amount').toggleClass('disabled');
    });

  createTrigger()
});

function setupSocial(charityTwitter, charityId, triggerName) {
  $('.js-charity-handles').text(charityTwitter);
  $('.js-trigger-name').text(triggerName);
  var urlTrigger = triggerName.replace(' ', '+');
  var urlCharity = charityId.replace('-', '');
  var linkTrigger =  'http://www.donatefordonald.org/trigger=' + urlTrigger + '&charity=' + urlCharity;
  $('.js-landing-link').prop('href', linkTrigger).text(linkTrigger);
}


function createTrigger() {
  if ($('.social-page').length) {
    return;
  }

  var rawTrigger = localStorage.getItem('trigger');
  if (rawTrigger) {
    delete userTrigger.charityName;
    delete userTrigger.triggerName;
    delete userTrigger.twitter;

    jQuery.ajax({
      type: 'post',
      url: '/api/triggers',
      data: userTrigger,
      success: function (data) {
        localStorage.clear();
        if ($('.triggers-page').length) {
          location.reload()
        }
      },
      dataType: 'json'
    });
  }
}
