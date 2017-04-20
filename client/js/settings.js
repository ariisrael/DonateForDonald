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
    maximumLoading()

    var originalMaximum = $('#monthly-maximum .monthly-maximum-data').data('maximum')
    var newLimit = $('#monthly-maximum input').val()
    if (originalMaximum && originalMaximum == newLimit) {
      return maximumSuccess()
    }
    var data = {
      monthlyLimit: $('#monthly-maximum input').val()
    }

    jQuery.ajax({
      type: 'put',
      url: '/api/users/' + user.id,
      data: data,
      success: function() {
        $('#monthly-maximum .monthly-maximum-data').data('maximum', newLimit)
        maximumSuccess()
      },
      dataType: 'json'
    })
  })

  $('#social-toggle .js-social-active-button').click(function(e) {
    e.preventDefault()
    var self = this;
    var url = '/api/social/'
    $(self).addClass('loading disabled')
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
      $(self).removeClass('loading disabled')
      $('.js-social-active-button').toggleClass('hide')
    })
  })

})

function maximumSuccess() {
  $('#monthly-maximum button').removeClass('loading disabled')
}

function maximumLoading() {
  $('#monthly-maximum button').addClass('loading disabled')
}
