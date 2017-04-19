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

})
