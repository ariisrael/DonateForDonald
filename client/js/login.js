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

  $('header a.login').on('click', function(event) {
    event.preventDefault()
    var path = window.location.pathname
    var query = '?redirect=' + encodeURIComponent(path)
    window.location.replace('/login' + query)
  })

  setupLoginRedirect()
})

function setupLoginRedirect() {
  if (!$('.login-page').length) return
  var redirectPath = ''
  if (user.paymentToken && user.skipSocial) {
    redirectPath = '/triggers'
  } else if (user.paymentToken) {
    redirectPath = '/social'
  } else {
    redirectPath = '/payment'
  }
  redirectPath = encodeURIComponent(redirectPath)
  var loginUrl = $('#login-form').attr('action')
  loginUrl += '?redirect=' + redirectPath
  $('#login-form').attr('action', loginUrl)
  var fbUrl = $('.js-fb-login-button').attr('href')
  fbUrl += '?redirect=' + redirectPath
  $('.js-fb-login-button').attr('href', fbUrl)
}
