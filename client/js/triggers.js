$(document).ready(function () {
  if (!$('.triggers-page').length) return;

  $('.js-share-button').popup();

  $('.js-edit-button').on('click', function () {
    var id = $(this).data('id');
    $('.ui.modal .js-editing-trigger-id').data('id', id);
    var metadata = $('.js-trigger-id-' + id + ' .trigger-data')
    var term = metadata.data('term')
    var amount = metadata.data('amount')
    var charity = metadata.data('charity')
    $('.ui.modal input[name="charity"]').val(charity).trigger('change');
    $('.ui.modal input[name="amount"]').val(amount)
    $('.modal .js-term').text(term)
    $('.ui.modal').modal('show');
  });

  $('.ui.modal .js-delete-trigger').on('click', function() {
    $('.ui.modal .actions.js-actions-primary').addClass('hide')
    $('.ui.modal .actions.js-actions-confirm').removeClass('hide')
  })

  $('.ui.modal .js-delete-trigger-cancel').on('click', function() {
    $('.ui.modal .actions.js-actions-primary').removeClass('hide')
    $('.ui.modal .actions.js-actions-confirm').addClass('hide')
  })

  $('.ui.modal .js-delete-trigger-confirm').on('click', function() {
    var id = $('.ui.modal .js-editing-trigger-id').data('id');
    var url = '/api/triggers/' + id
    jQuery.ajax({
      type: 'delete',
      url: url,
    })
    .done(function(data, textStatus, jqXHR) {
      $('.js-trigger-id-' + id).remove()
      $('.ui.modal .actions.js-actions-primary').removeClass('hide')
      $('.ui.modal .actions.js-actions-confirm').addClass('hide')
      $('.ui.modal').modal('hide');
    })
    .fail(function(data, textStatus, errorThrown) {
      $('.ui.modal .actions.js-actions-primary').removeClass('hide')
      $('.ui.modal .actions.js-actions-confirm').addClass('hide')
      $('.ui.modal').modal('hide');
      // TODO: put a popup message on failure
    })
  })

  $('.ui.modal .js-update-trigger').on('click', function() {
    var id = $('.ui.modal .js-editing-trigger-id').data('id');

    var data = {
      charityId: $('.ui.modal input[name="charity"]').val(),
      amount: $('.ui.modal input[name="amount"]').val()
    }

    updateTrigger(id, data, function(error, data) {
      if (error) {
        // TODO: deal with this
      } else {
        $('.js-trigger-id-' + id + ' .charity-image img').attr('src', data.charity.image)
        var metadata = $('.js-trigger-id-' + id + ' .trigger-data')
        metadata.data('amount', data.trigger.amount)
        $('.js-trigger-id-' + id + ' .trigger-amount').text(data.trigger.amount)
        metadata.data('charity', data.charity._id)
        $('.js-trigger-id-' + id + ' .charity-name').text(data.charity.name)
      }
      $('.ui.modal').modal('hide');
    })
  })

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
