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
    var data = {
      monthlyLimit: $('#monthly-maximum input').val()
    }

    jQuery.ajax({
      type: 'put',
      url: '/api/users/' + user.id,
      data: data,
      success: function() {
        $('#monthly-maximum .js-money').fadeOut(function() {
          $('#monthly-maximum .js-approved').fadeIn(function() {
            setTimeout(function() {
              $('#monthly-maximum .js-approved').fadeOut(function() {
                $('#monthly-maximum .js-money').fadeIn()
              })
            }, 2000)
          })
        })
      },
      dataType: 'json'
    })
  })

})
