$(document).ready(function() {
  if (!$('.settings-page').length) return;

  $('form#delete-account button').on('click', function(e) {
    e.preventDefault()
    $('.ui.modal.delete-account')
      .modal('show');
  })

  $('.ui.modal.delete-account .js-confirm-delete').on('click', function() {
    $('form#delete-account').submit()
  })

  $('#monthly-maximum button').click(function(e) {
    e.preventDefault()
    var originalMaximum = $('#monthly-maximum .monthly-maximum-data').data('maximum')
    var newLimit = $('#monthly-maximum input').val()
    if (originalMaximum && originalMaximum == newLimit) {
      fadeMaximumSuccess()
    }
    var data = {
      monthlyLimit: $('#monthly-maximum input').val()
    }

    jQuery.ajax({
      type: 'put',
      url: '/api/users/' + user.id,
      data: data,
      success: function() {
        fadeMaximumSuccess()
      },
      dataType: 'json'
    })
  })

  $('#social-toggle .js-social-active-button').click(function(e) {
    e.preventDefault()
    var self = this;
    var url = '/api/social/'
    $(self).find('i').toggleClass('hide')
    $(self).attr('disabled', true)
    if ($(self).hasClass('js-enable')) {
      url += 'enable'
    } else {
      url += 'disable'
    }
    jQuery.ajax({
      type: 'post',
      url: url
    })
    .done(function() {
      $(self).find('i').toggleClass('hide')
      $(self).attr('disabled', false)
      $('.js-social-active-button').toggleClass('hide')
    })
  })

})

function fadeMaximumSuccess() {
  $('#monthly-maximum .js-money').fadeOut(function() {
    $('#monthly-maximum .js-approved').fadeIn(function() {
      setTimeout(function() {
        $('#monthly-maximum .js-approved').fadeOut(function() {
          $('#monthly-maximum .js-money').fadeIn()
        })
      }, 2000)
    })
  })
}
