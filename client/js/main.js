$(document).ready(function () {
  // User toggles maximum monthly donation
  $(".js-maximum-toggle")
    .on('click', function () {
      $('.js-maximum-amount').toggleClass('disabled');
    });

  unsavedNag()
  triggerPage()

  $('.js-close-nag').on('click', function () {
    $(this).parents('.d4d-nag').css('display', 'none');
  });

  $('.disgard-trigger').on('click', function () {
    localStorage.removeItem('trigger');
    $(this).parents('.d4d-nag').css('display', 'none');
  });


});

function setupSocial(charityTwitter, charityId, triggerName) {
  $('.js-charity-handles').text(charityTwitter);
  $('.js-trigger-name').text(triggerName);
  var urlTrigger = triggerName.replace(' ', '+');
  var urlCharity = charityId.replace('-', '');
  var linkTrigger =  'http://www.donatefordonald.org/trigger=' + urlTrigger + '&charity=' + urlCharity;
  $('.js-landing-link').prop('href', linkTrigger).text(linkTrigger);
}

function unsavedNag() {
  if ($('.social-page').length || $('.login-page').length || $('.payment-page').length) {
    return;
  }

  if ($('.triggers-page').length && getQueryVariable('login') && getQueryVariable('created')) {
    localStorage.clear()
  } else if (localStorage.getItem('trigger')) {
    $('.js-unsaved-nag').css('display', 'block');
  }
}
