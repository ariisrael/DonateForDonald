$(document).ready(function () {
  // Toggle amount selector buttons between active/inactive

  $(".toggle")
    .on('click', function () {
      $(this).toggleClass('selected-amount');
      $(".selected-amount").not(this).removeClass('selected-amount');

      $(".dollar-sign").addClass("greyed-out");
      $(".js-amount-other input").val("");
      $(".js-amount-other input").prop("placeholder", "25");
    });
  // User clicked other amount input
  $(".js-amount-other")
    .on('click', function () {
      // Enable text field
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
  })
  // User clicked 'login' button
  $('.js-login button').on('click', function () {
  });

  noLinkReload();

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

  // User selected a trigger from the dropdown
  $('.js-select-trigger').on('click', 'div.item', function () {
    $('.js-tweets').css('border', 'inherit').removeClass('disabled');
  });
  // User selected a trigger from the dropdown
  $('.js-select-trigger').on('keyup click', function (e) {
    $('.js-tweets').css('border', 'inherit').removeClass('disabled');
    if (e.which === 13 || e.which === 1) {
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
        tweetsHTML += tweetHtml(data.tweets[i]._id)
      }
      $('.tweets').append(tweetsHTML);
      twttr.widgets.load();
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
  charities.forEach(function(c) {
    if(c.ein === charity) {
      charityName = c.name;
    }
  });
  var userTrigger = {
    "charityId": charity,
    "name": trigger,
    "amount": amount,
    "charityName": charityName
  }
  var errors = validateTrigger(userTrigger);
  if (!errors) {
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
  } else {
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

function deselectInput() {
  $("input[name='amount']").css('border-top', '');
  $("input[name='amount']").css('border-right', '');
  $("input[name='amount']").css('border-bottom', '');
}

function selectInput() {
  $("input[name='amount']").css('border-top', '1px solid #aaa');
  $("input[name='amount']").css('border-right', '1px solid #aaa');
  $("input[name='amount']").css('border-bottom', '1px solid #aaa');
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
      if ($('.js-tweet-drawer').hasClass('visible')) {
        loadTweets(trigger);
      }
    }
  });
}

$(document).ready(function () {
  function updateTrigger(id, data, callback) {
    var url = '/api/triggers/' + id
    jQuery.ajax({
      type: 'put',
      url: url,
      data: data,
    })
    .done(function(data, textStatus, jqXHR) {
      callback(null, data)
    })
    .fail(function(data, textStatus, errorThrown) {
      callback(errorThrown, data)
    })
  }

  $('.js-share-button').popup();

  $('.js-edit-button').on('click', function () {
    $('.ui.modal').modal('show');
  });

  $('.js-trigger-item .js-active-button').on('click', function(evt) {
    var self = this;
    var id = $(this).data('id')
    $(this).find('.icon').toggleClass('hide')
    $(this).toggleClass('disabled')
    var data = {}
    if ($(this).hasClass('js-disable')) {
      data.active = false
    } else {
      data.active = true
    }

    updateTrigger(id, data, function(error, data) {
      var classList = '.js-trigger-id-' + id + ' .js-active-button'
      if (!error) {
        $(classList).toggleClass('hide')
      }
      $(self).find('.icon').toggleClass('hide')
      $(self).toggleClass('disabled')
    })
  });

  $('.js-close-nag').on('click', function () {
    $('.js-email-nag').css('display', 'none');
  });
})


var whitelist = ['Ocare', 'Chicago', 'inner cities', 'sad', 'total scam', 'Obama', 'Jobs, Jobs, Jobs', 'ratings', 'The Apprentice', 'unmasking'];
var blacklist = ['washinon', 'jobs jobs jobs'];
$('.main-landing').ready(function () {

  jQuery.getJSON('/api/terms', function (data) {
    var postedTerms = [];
    for (var i = 0; i < data.length; i++) {
      var html = '<div class="js-trigger-item item">' + data[i].term + '</div>';
      if (blacklist.indexOf(data[i].term.toLowerCase()) < 0 && postedTerms.indexOf(data[i].term.toLowerCase()) < 0) {
        $('.js-select-trigger .js-fill').append(html);
        postedTerms.push(data[i].term.toLowerCase());
      }
    }
    var wlHtml = '';
    whitelist.forEach(function (term) {
      if (postedTerms.indexOf(term.toLowerCase()) < 0) {
        wlHtml = '<div class="item js-trigger-item">' + term + '</div>';
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

function tweetHtml(id) {
  var html = '<div class="tweet-embed"><blockquote class="twitter-tweet tw-align-center" data-lang="en" data-conversation="none"><a class="tweet-link" href="' + twitterUrl(id) + '"></a></blockquote></div>';
  return html;
}
