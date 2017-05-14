$(document).ready(function () {
  // User toggles maximum monthly donation
  $(".js-maximum-toggle")
    .on('click', function () {
      $('.js-maximum-amount').toggleClass('disabled');
    });

  $('header .menu .ui.dropdown').dropdown({});

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
