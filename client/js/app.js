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
})
