$(document).ready(function() {
  // Toggle amount selector buttons between active/inactive
  $(".toggle")
    .on('click', function () {
      $(this).toggleClass('selected-amount');
      $(".selected-amount").not(this).removeClass('selected-amount');
      $(".dollar-sign").addClass("greyed-out");
      $(".js-amount-other input").val("");
      $(".js-amount-other input").prop("placeholder", "25");
      validateLanding();
    });
  // User clicked other amount input
  $(".js-amount-other")
    .on('click', function () {
      // Enable text field
      validateLanding();
      $(".dollar-sign").removeClass("greyed-out");
    });
  // User toggles maximum monthly donation
  $(".js-maximum-toggle")
    .on('click', function () {
      $('.js-maximum-amount').toggleClass('disabled');
    });

  // User typing other amount (validate)
  $(".mobile-amount")
    .on('keyup', function () {
      validateLanding();
    });

  // User clicked 'View Tweets'
  $('.js-tweets')
    .on('click', function () {
      if ($('.js-tweet-drawer').hasClass('visible')) {
        $(this).html('<i class="twitter icon"></i> View Tweets');

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
  noLinkReload();

  // User selected a trigger from the dropdown
  $('.js-select-trigger').on('click', 'div.item', function () {
    $('.js-tweets').css('border', 'inherit').removeClass('disabled');
    validateLanding();
  });
  // User selected a trigger from the dropdown
  $('.js-select-trigger').on('keyup click', function (e) {
    $('.js-tweets').css('border', 'inherit').removeClass('disabled');
    if (e.which === 13 || e.which === 1) {
      var term = $('input[name=trigger]').val()
      $('input[name="trigger"]').val(term);
      if ($('.js-tweet-drawer').hasClass('visible')) {
        loadTweets(term);
      }
    }
    validateLanding();
  });
  // User selected a charity from dropdown
  $('.js-select-charity').on('click', function () {
    validateLanding();
  });


})


function loadTweets(term) {
  var currentTrigger = $('.js-tweet-term').text();
  if (currentTrigger && currentTrigger === term) {
    return;
  }
  updateTweetTerm(term);
  $('.tweets').empty();
  var url = '/api/tweets/search?q=' + encodeURIComponent(term);
  jQuery.getJSON(url, function (data) {
    if (data.tweets && data.tweets.length !== 0) {
      updateTweetCount(data.count);
      var tweetsHTML = ""
      for (var i = 0; i < data.tweets.length; i++) {
        tweetsHTML += tweetHtml(data.tweets[i]._id, data.tweets[i].text)
      }
      $('.tweets').append(tweetsHTML);
      twttr.widgets.load().then(function() {
        $('.tweets .pre-load').removeClass('pre-load')
      });
    } else {
      $('.tweets').append('<p style="text-align: center; font-size: 20px; margin-top: 30px">No tweets</p>')
      updateTweetCount(0);
    }
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
  var charityName;
  var triggerName;
  if(trigger) {
    triggerName = $('.js-trigger-text').text();
    console.log('Capitalized', triggerName);
  }
  charities.forEach(function(c) {
    if(c.ein === charity) {
      charityName = c.name;
    }
  });
  var userTrigger = getLandingInputs();
  userTrigger.charityName = charityName;
  userTrigger.triggerName = triggerName;
  if (user) { // User signed in, store in db
    localStorage.setItem('trigger', JSON.stringify(userTrigger));
    if (user.paymentToken) {
      window.location.replace('/social');
    } else {
      window.location.replace('/payment');
    }
  }
  else { // The user is not signed in
    localStorage.setItem('trigger', JSON.stringify(userTrigger));
    window.location.replace("/login");
  }
}

function updateTweetCount(num) {
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
      $('.js-tweets').css('border', 'inherit').removeClass('disabled');
      $('input[name="trigger"]').val(trigger);
      $('.js-trigger-text').text(trigger);
      $('.js-trigger-text').removeClass('default')
      $('.js-trigger-item').removeClass('active')
      $('*[data-term="' + trigger + '"]').addClass('active')
      if ($('.js-tweet-drawer').hasClass('visible')) {
        loadTweets(trigger);
      }
    }
  });
}

var whitelist = ['Ocare', 'Chicago', 'inner cities', 'sad', 'total scam', 'Obama', 'Jobs, Jobs, Jobs', 'ratings', 'The Apprentice', 'unmasking'];
var blacklist = ['washinon', 'jobs jobs jobs'];
$('.main-landing').ready(function () {
  jQuery.getJSON('/api/terms', function (data) {
    $('.message').css('display', 'none');
    var postedTerms = [];
    for (var i = 0; i < data.length; i++) {
      var html = '<div class="js-trigger-item item" data-term="' + data[i].term + '">' + data[i].term + '</div>';
      if (blacklist.indexOf(data[i].term.toLowerCase()) < 0 && postedTerms.indexOf(data[i].term.toLowerCase()) < 0) {
        $('.js-select-trigger .js-fill').append(html);
        postedTerms.push(data[i].term.toLowerCase());
      }
    }
    var wlHtml = '';
    whitelist.forEach(function (term) {
      if (postedTerms.indexOf(term.toLowerCase()) < 0) {
        wlHtml = '<div class="item js-trigger-item" data-term="' + term + '">' + term + '</div>';
        $('.js-select-trigger .js-fill').append(wlHtml);
      }
    });
  })
})

function getClickedLabel(text) {
  if(text) {
    return text.replace('?word=', '');
  }
}

function twitterUrl(id) {
  return "https://twitter.com/realDonaldTrump/status/" + id
}

function tweetHtml(id, text) {
  var html = '<div class="tweet-embed pre-load"><blockquote class="twitter-tweet tw-align-center" data-lang="en" data-conversation="none"><a class="tweet-link" href="' + twitterUrl(id) + '"></a><div class="embedded-tweet"><div class="twitter-header-wrapper"><div class="twitter-img-wrapper"><img src="https://pbs.twimg.com/profile_images/1980294624/DJT_Headshot_V2_bigger.jpg" height=36px width=36px></div><div class="twitter-ident-wrapper"><span class="identity-name">Donald J. Trump</span> <br> <span class="screen-name">@realDonaldTrump</span></div></div><p>' + text + '</p></div></blockquote></div>';
  return html;
}


function getLandingInputs() {
  var charity = $('input[name=charity]').val().trim();
  var trigger = $('input[name=trigger]').val().trim();
  var amount = ($('.js-toggle-other').hasClass('selected-amount')) ? $('input[name=amount]').val() : $('.selected-amount').text();
  amount = amount.replace('$', '').trim();
  return {
    charityId: charity,
    name: trigger,
    amount: amount,
  }
}

function enableDonate() {
  $('.js-donate button').addClass('primary'); //blue
  $('.js-donate button').removeClass('disabled'); //enabled
}

function disableDonate() {
  $('.js-donate button').removeClass('primary'); //blue
  $('.js-donate button').addClass('disabled'); //enabled
}


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function validateLanding() {
  var inputs = getLandingInputs();
  if (Object.keys(inputs).length === 3 && isNumeric(inputs.amount) && (inputs.charityId.length === 10 && inputs.charityId.indexOf('-')) && inputs.name.length > 0) {
    enableDonate();
  } else {
    disableDonate();
  }
}
