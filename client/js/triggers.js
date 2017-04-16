$(document).ready(function () {
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
