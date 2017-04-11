var mailgun = require('../config/mailgun')
var app = require('../app')

exports.welcomeEmail = function (name, email, token, callback) {
  var params = {
    layout: 'email',
    name: name,
    token: token,
    email: email,
    baseUrl: app.get('baseUrl')
  }
  app.render('email/welcome', params, (err, html) => {
    if (err) {
      console.log(err)
      return callback(err, null)
    }
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

exports.forgotEmail = function (name, email, token, callback) {
  var params = {
    layout: 'email',
    name: name,
    email: email,
    token: token,
    baseUrl: app.get('baseUrl')
  }
  app.render('email/forgot', params, (err, html) => {
    if (err) {
      console.log(err)
      return callback(err, null)
    }
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

exports.changedEmail = function (name, email, callback) {
  var params = {
    layout: 'email',
    name: name,
    email: email,
    token: token,
    baseUrl: app.get('baseUrl')
  }
  app.render('email/passwordChanged', params, (err, html) => {
    if (err) {
      console.log(err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <noreply@hackthecyber.com>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Your password has been changed',
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(error)
      console.log(body);
      callback(error, body)
    });
  })
}
