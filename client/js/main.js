$(document).ready(function () {
  // User toggles maximum monthly donation
  $(".js-maximum-toggle")
    .on('click', function () {
      $('.js-maximum-amount').toggleClass('disabled');
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
