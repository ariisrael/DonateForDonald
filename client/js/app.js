function tokenize(form) {
  // TODO: Save token to database
}

$(document).ready(function() {
  $('#login-form .login-button').on('click', function(event) {
    event.preventDefault()
    $('#login-form').attr('action', '/login')
    $('#login-form').submit()
  })
  $('#login-form .signup-button').on('click', function(event) {
    event.preventDefault()
    $('#login-form').attr('action', '/signup')
    $('#login-form').submit()
  })

  if (landing) {
    jQuery.getJSON('/api/terms', function(data) {
      for (var i = 0; i < data.length; i++) {
        var html = '<div class="item">' + data[i].term + '</div>'
        $('.js-select-trigger .js-fill').append(html)
      }
    })
  }


})
