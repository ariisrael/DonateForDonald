var mailgun = require('../config/email')
var app = require('../index')

function welcomeEmail(name, email, callback) {
  var params = {
    layout: 'email',
    name: name
  }
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

function forgotEmail(name, email, callback) {
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
