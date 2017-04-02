$(document).ready(function () {
  // Toggle amount selector buttons between active/inactive
  $(".toggle")
    .on('click', function () {
      $(this).toggleClass('selected-amount');
      $(".selected-amount").not(this).removeClass('selected-amount');
      $(".js-amount-other input").prop("disabled", true);
      $(".dollar-sign").addClass("greyed-out");
      $(".js-amount-other input").val("");
      $(".js-amount-other input").prop("placeholder", "25");
    });
// User clicked other amount input
  $(".js-amount-other")
    .on('click', function () {
      // Enable text field
      $("input", this).prop('disabled', false);
      $(".dollar-sign").removeClass("greyed-out");
    });

// User toggles maximum monthly donation 
$(".js-maximum-toggle")
  .on('click', function() {
    $('.js-maximum-amount').toggleClass('disabled');
  });

// User started typing other amount
  $(".js-amount-other input")
    .on('focus', function () {
      // Clear placeholder text when user clicks input
      $(this).prop("placeholder", "");
    });
// User clicked 'View Tweets'
  $('.js-tweets')
    .on('click', function () {
      if ($('.js-tweet-drawer').hasClass('visible')) {
        $(this).html('<i class="twitter icon"></i> View Tweets');
      } else {
        // Switch button to hide tweets
        $(this).html('<i class="cancel icon"></i> Hide Tweets');
      }
      // Open drawer w/ tweet list
      $('.js-tweet-drawer').toggleClass('visible');
    });
// User clicked 'x' to close tweets
  $('.js-close-tweets')
    .on('click', function () {
      $('.js-tweet-drawer').removeClass('visible');
      $('.js-tweets').html('<i class="twitter icon"></i> View Tweets');
    });
// User selected dropdown option
  $('.selection').dropdown({
      onChange: function (value) {
        $('.demo.icon').popup({ transition: value }).popup('toggle');
      }
    });

// Update tweet count
$('.js-tweet-count').text();

// User clicked 'donate' button
  $('.js-donate button').on('click', function() {
    console.log('Donate button clicked');
  })
// User clicked 'login' button
  $('.js-login button').on('click', function() {
    console.log('Login button clicked');
  });
// User clicked tweet tag in drawer
  $('.js-tweet-triggers > .labels > a').on('click', function() {
    var tag = $(this).text().trim();
    console.log(tag + ' tag clicked');
  });
// User selected a trigger from the dropdown
  $('.js-select-trigger .item').on('click', function() {
    console.log('Selected', $(this).text().trim());
  });
// User selected a charity from dropdown
  $('.js-select-charity .item').on('click', function() {
    console.log('Selected', $(this).text().trim());
  });
});
