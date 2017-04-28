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
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Confirm Your Donate For Donald Account',
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(error)
      console.log(body);
      callback(error, body)
    });
  })
}

exports.confirmEmail = function (name, email, token, callback) {
  var params = {
    layout: 'email',
    name: name,
    token: token,
    email: email,
    baseUrl: app.get('baseUrl')
  }
  app.render('email/confirm', params, (err, html) => {
    if (err) {
      console.log(err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Confirm Your Donate For Donald Account',
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
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Reset Your Donate For Donald Password',
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
    baseUrl: app.get('baseUrl')
  }
  app.render('email/passwordChanged', params, (err, html) => {
    if (err) {
      console.log(err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: "Your Password Recently Changed - Was It Lyin' Ted?",
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(error)
      console.log(body);
      callback(error, body)
    });
  })
}

exports.donatedEmail = function (name, email, tweetBody, tweetID, callback) {
  // allow this to be configurable
  if (!app.get('sendDonationEmail')) return;
  var params = {
    layout: 'email',
    name: name,
    email: email,
    tweetBody: tweetBody,
    tweetID: tweetID,
    baseUrl: app.get('baseUrl')
  }
  app.render('email/donated', params, (err, html) => {
    if (err) {
      console.log(err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: "You Just Donated For Donald- Read The Tweet!",
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(error)
      console.log(body);
      callback(error, body)
    });
  })
}
