var mailgun = require('../config/mailgun')
var app = require('../index')

exports.welcomeEmail = function (name, email, token, callback) {
  var params = {
    layout: 'email',
    name: name,
    token: token,
    email: email,
    baseUrl: app.get('baseUrl')
  }
  data.forEach((k, v) => {
    params[k] = v
  })
  app.render('email/welcome', params, (err, html) => {
    console.log(err)
    var data = {
      from: 'Donate for Donald <noreply@hackthecyber.com>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Welcome!!!',
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(error)
      console.log(body);
      callback(error, body)
    });
  })
}

exports.forgotEmail = function (name, email, data, callback) {
  var params = {
    layout: 'email',
    name: name
  }
  app.render('email/forgot', params, (err, html) => {
    console.log(err)
    var data = {
      from: 'Donate for Donald <noreply@hackthecyber.com>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'You forgot your password! Sad!',
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(error)
      console.log(body);
      callback(error, body)
    });
  })
}
