function triggerPage() {
  if (!$('.triggers-page').length) return;

  $('.js-share-button').popup();

  $('.js-edit-button').on('click', function () {
    var id = $(this).data('id');
    $('.ui.modal.edit-trigger .js-editing-trigger-id').data('id', id);
    var metadata = $('.js-trigger-id-' + id + ' .trigger-data')
    var term = metadata.data('term')
    var amount = metadata.data('amount')
    var charity = metadata.data('charity');

    $('.js-editing-trigger-data').data('trigger', {
      charityId: charity,
      amount: amount
    })
    $('.ui.modal.edit-trigger input[name="charity"]').val(charity).trigger('change');
    $('.ui.modal.edit-trigger input[name="amount"]').val(amount)
    $('.modal .js-term').text(term)

    if ($('.ui.modal.edit-trigger .actions.js-actions-primary').hasClass('hide')) {
      $('.ui.modal.edit-trigger .actions').toggleClass('hide')
    }

    $('.ui.modal.edit-trigger').modal('show');
  });

  $('.ui.modal.edit-trigger .js-delete-trigger').on('click', function() {
    $('.ui.modal.edit-trigger .actions').toggleClass('hide')
  })

  $('.ui.modal.edit-trigger .js-delete-trigger-cancel').on('click', function() {
    $('.ui.modal.edit-trigger .actions').toggleClass('hide')
  })

  $('.ui.modal.edit-trigger .js-delete-trigger-confirm').on('click', function() {
    var id = $('.ui.modal.edit-trigger .js-editing-trigger-id').data('id');
    var url = '/api/triggers/' + id
    jQuery.ajax({
      type: 'delete',
      url: url,
    })
    .done(function(data, textStatus, jqXHR) {
      $('.js-trigger-id-' + id).remove()
      if (!$('.js-trigger-item').length) {
        $('.js-no-triggers').toggleClass('hide')
      }
      $('.ui.modal.edit-trigger .actions').toggleClass('hide')
      $('.ui.modal.edit-trigger').modal('hide');
    })
    .fail(function(data, textStatus, errorThrown) {
      $('.ui.modal.edit-trigger .actions').toggleClass('hide')
      $('.ui.modal.edit-trigger').modal('hide');
      // TODO: put a popup message on failure
    })
  })

  $('.ui.modal.edit-trigger .js-update-trigger').on('click', function() {
    var id = $('.ui.modal.edit-trigger .js-editing-trigger-id').data('id');

    var data = {
      charityId: $('.ui.modal.edit-trigger input[name="charity"]').val(),
      amount: $('.ui.modal.edit-trigger input[name="amount"]').val()
    }
    var trigger = $('.ui.modal.edit-trigger .js-editing-trigger-data').data('trigger');
    if (trigger.charityId == data.charityId && trigger.amount == data.amount) {
      return $('.ui.modal.edit-trigger').modal('hide');
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
      $('.ui.modal.edit-trigger').modal('hide');
    })
  })

  $('.js-trigger-item .js-active-button').on('click', function(evt) {
    var self = this;
    var id = $(this).data('id')
    $(self).toggleClass('disabled loading')
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
      $(self).toggleClass('disabled loading')
    })
  });

  $('.js-trigger-item .js-social-active-button').on('click', function(evt) {
    var self = this;
    var id = $(this).data('id')
    $(self).toggleClass('disabled loading')
    var data = {}
    if ($(this).hasClass('js-disable')) {
      data.social = false
    } else {
      data.social = true
    }

    updateTrigger(id, data, function(error, data) {
      var classList = '.js-trigger-id-' + id + ' .js-social-active-button'
      if (!error) {
        $(classList).toggleClass('hide')
      }
      $(self).toggleClass('disabled loading')
    })
  });

    $('.email-nag .new-link').click(function(evt) {
      evt.preventDefault()
      var self = this;
      sendConfirmationEmail(function(err, data) {
        $(self).parents('.d4d-nag').css('display', 'none');
      })
    })

}

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

function sendConfirmationEmail(callback) {
  jQuery.ajax({
    type: 'post',
    url: '/api/resend-confirmation-email'
  })
  .done(function(data, textStatus, jqXHR) {
    callback(null, data)
  })
  .fail(function(data, textStatus, errorThrown) {
    callback(errorThrown, data)
  })
}
