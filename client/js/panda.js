$(document).ready(function() {
  // only initialize it if it should be initialized
  if ($('.payment-page').length || $('.settings-page').length) {
    Panda.init('pk_test_DGoDgSY4_9eNPYwXWQyNKg', 'payment-form');

    Panda.on('success', function (cardToken) {
      // You now have a token you can use to refer to that credit card later.
      // This token is used in PandaPay API calls for creating donations and grants
      // so that you don't have to worry about security concerns with dealing with
      // credit card data.
      var data = { paymentToken: cardToken }
      if($('.js-maximum-amount input').val() && $('.js-maximum-amount input').val() !== 0 ) {
        var maximum = $('.js-maximum-amount input').val();
        data.monthlyLimit = maximum;
      }
      jQuery.ajax({
        type: 'put',
        url: '/api/users/' + user.id,
        data: data,
        success: function() {
          if ($('.payment-page').length) {
            window.location.replace("/social");
          } else {
            console.log('success')
          }
        },
        dataType: 'json'
      })
    });

    Panda.on('error', function (errors) {
      // errors is a human-readable list of things that went wrong
      //  (invalid card number, missing last name, etc.)
      console.log(errors);
    });
  }
})
