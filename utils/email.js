var mailgun = require('../config/mailgun')
var app = require('../app')

const createLogger = require('logging').default;
const log = createLogger('email');

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
      log.info('error rendering email: ', err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Confirm Your Donate For Donald Account',
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) log.info('error sending email: ', error)
      log.info('response from mailgun: ', body);
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
      log.info('error rendering email: ', err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Confirm Your Donate For Donald Account',
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) log.info('error sending email: ', error)
      log.info('response from mailgun: ', body);
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
      log.info('error rendering email: ', err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Reset Your Password',
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) log.info('error sending email: ', error)
      log.info('response from mailgun: ', body);
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
      log.info('error rendering email: ', err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email,
      subject: "Did You Make Your Password Great Again?",
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) log.info('error sending email: ', error)
      log.info('response from mailgun: ', body);
      callback(error, body)
    });
  })
}

exports.donatedEmail = function (name, email, tweetBody, tweetID, callback) {
  // allow this to be configurable
  if (!app.get('sendOptionalEmail')) {
    return callback(null, null);
  }
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
      log.info('error rendering email: ', err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email,
      subject: "You Just Donated For Donald. CONGRATULATIONS!",
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) log.info('error sending email: ', error)
      log.info('response from mailgun: ', body);
      callback(error, body)
    });
  })
}

exports.paymentFailedEmail = function (name, email, charity, callback) {
  // allow this to be configurable
  if (!app.get('sendOptionalEmail')) {
    return callback(null, null);
  };
  var params = {
    layout: 'email',
    name: name,
    email: email,
    charity: charity.name,
    baseUrl: app.get('baseUrl')
  }
  app.render('email/payment-failed', params, (err, html) => {
    if (err) {
      log.info('error rendering email: ', err)
      return callback(err, null)
    }
    var data = {
      from: 'Donate for Donald <' + app.get('email') + '>',
      to: email, // you need to register the email on mailgun since this is a test account
      subject: 'Your Donation Failed. SAD! Update Your Payment.',
      html: html
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) log.info('error sending email: ', error)
      log.info('response from mailgun: ', body);
      callback(error, body)
    });
  })
}
