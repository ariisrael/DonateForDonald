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
    .on('click', function () {
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
        $('main').css('overflow-y', 'auto');

      } else {
        // Switch button to hide tweets
        var trigger = $('input[name=trigger]').val().trim();

        loadTweets(trigger);
        $(this).html('<i class="cancel icon"></i> Hide Tweets');
        $('main').css('overflow-y', 'hidden');
        $('body').css('overflow-y', 'hidden');
        $('html').css('overflow-y', 'hidden');

      }
      $('.js-nav').removeClass('visible');
      // Open drawer w/ tweet list
      $('.js-tweet-drawer').toggleClass('visible');

    });
  // User clicked 'x' to close tweets
  $('.js-close-tweets')
    .on('click', function () {
      $('.js-tweet-drawer').removeClass('visible');
      $('.js-tweets').html('<i class="twitter icon"></i> View Tweets');
      $('.js-nav').addClass('visible');
      $('main').css('overflow-y', 'auto');
      $('body').css('overflow-y', 'auto');
      $('body').css('overflow-x', 'hidden');

      $('html').css('overflow-y', 'auto');
      $('html').css('overflow-x', 'hidden');
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
  $('.js-donate button').on('click', function () {
    console.log('Donate button clicked');
  })
  // User clicked 'login' button
  $('.js-login button').on('click', function () {
    console.log('Login button clicked');
  });

  noLinkReload();

  // User selected a trigger from the dropdown
  $('.js-select-trigger').on('click', 'div.item', function () {
    var term = $(this).text().trim();
    loadTweets(term);
  });
  // User selected a trigger from the dropdown
  $('.js-select-trigger').on('keyup', function (e) {
    if (e.which === 13) {
      var term = $('input[name=trigger]').val()
      if ($('.js-tweet-drawer').hasClass('visible')) {
        loadTweets(term);
      }
    }
  });
  // User selected a charity from dropdown
  $('.js-select-charity .item').on('click', function () {
  });
});

function loadTweets(term) {
  var url = 'api/tweets/search?q=' + encodeURIComponent(term);
  jQuery.getJSON(url, function (data) {
    $('.tweets').empty();
    if (data.tweets && data.tweets.length !== 0) {
      var tweetsHTML = ""
      for (var i = 0; i < data.tweets.length; i++) {
        tweetsHTML += tweetHtml(data.tweets[i]._id)
      }
      $('.tweets').append(tweetsHTML);
      updateTweetCount(data.count);
      twttr.widgets.load();
    } else {
      $('.tweets').append('<p style="text-align: center; font-size: 20px; margin-top: 30px">No tweets</p>')
      updateTweetCount(0);
    }
    updateTweetTerm(term);
  });
}

function updateTweetTerm(term) {
  $('.js-tweet-term').empty();
  $('.js-tweet-term').text(term);
}

function landingDonate() {
  var charity = $('input[name=charity]').val().trim();
  var trigger = $('input[name=trigger]').val().trim();
  var amount = ($('.amount-other a').hasClass('selected-amount')) ? $('input[name=amount]').val() : $('.selected-amount').text();
  amount = amount.replace('$', '').trim();
  var userTrigger = {
    "charityId": charity,
    "name": trigger,
    "amount": amount
  }
  var errors = validateTrigger(userTrigger);
  if (!errors) {
    if (user) { // User signed in, store in db
      localStorage.setItem('trigger', JSON.stringify(userTrigger));
      if (user.paymentToken || user.monthlyLimit) {
        window.location.replace('/social');
      } else {
        window.location.replace('/payment');
      }
    }
    else { // The user is not signed in
      localStorage.setItem('trigger', JSON.stringify(userTrigger));
      window.location.replace("/login");
    }
  } else {
  }
}

function updateTweetCount(num) {
  console.log(num)
  $('.js-tweet-count').empty();
  var number = '(' + num + ')';
  $('.js-tweet-count').text(number);
}

function validateTrigger(trigger) {
  var errors = [];
  if (!trigger.charityId || trigger.charityId.length !== 10) {
    errors.push({
      id: "",
      prompt: "Choose a charity"
    });
  }
  if (!trigger.name || trigger.name.length === 0) {
    errors.push({
      id: "",
      prompt: "Type a trigger"
    });
    $('.js-select-trigger input').addClass('error');

  }
  if (!trigger.amount) {
    errors.push({
      id: "",
      prompt: "Select an amount"
    });
  }
  if (errors.length === 0) {
    return false;
  }
  return errors;
}

function noLinkReload() {
  $('.js-word-cloud').on('click', 'a', function (event) {
    event.preventDefault();
    var trigger = getClickedLabel($(this).attr('href'));
    if(trigger) {
      $('input[name="trigger"]').val(trigger);
      $('.js-trigger-text').text(trigger);
      if ($('.js-tweet-drawer').hasClass('visible')) {
        loadTweets(term);
      }
    }
  });
}

function getClickedLabel(text) {
  if(text) {
    return text.replace('?word=', '');
  }
}

function twitterUrl(id) {
  return "https://twitter.com/realDonaldTrump/status/" + id
}

function tweetHtml(id) {
  var html = '<div class="tweet-embed"><blockquote class="twitter-tweet tw-align-center" data-lang="en" data-conversation="none"><a class="tweet-link" href="' + twitterUrl(id) + '"></a></blockquote></div>';
  return html;
}
