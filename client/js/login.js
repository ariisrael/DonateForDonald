function loginPage() {
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
}

function setupLoginRedirect() {
  if (!$('.login-page').length) return
  var redirect = ''
  if (getQueryVariable('create')) {
    redirect = 'create'
  }
  var loginUrl = $('#login-form').attr('action')
  loginUrl += '?redirect=' + redirect
  $('#login-form').attr('action', loginUrl)
  var fbUrl = $('.js-fb-login-button').attr('href')
  fbUrl += '?redirect=' + redirect
  $('.js-fb-login-button').attr('href', fbUrl)
}

function getQueryVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
