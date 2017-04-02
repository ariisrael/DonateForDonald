/**
 * GET /
 */
exports.landing = function(req, res) {
  res.render('landing', {
    title: 'Home'
  });
};

exports.payment = function(req, res) {
  res.render('payment', {
    title: 'Payment'
  });
}

exports.notifications = function(req, res) {
  res.render('notifications', {
    title: 'Notifications'
  });
}

exports.contact = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
}

exports.reset = function(req, res) {
  res.render('reset', {
    title: 'Reset'
  });
}

exports.settings = function(req, res) {
  res.render('settings', {
    title: 'Settings'
  })
}

exports.terms = function(req, res) {
  res.render('Terms', {
    title: 'terms'
  });
}

exports.donations = function(req, res) {
  res.render('Donations', {
    title: 'donations'
  });
}

exports.faq = function(req, res) {
  res.render('FAQ', {
    title: 'faq'
  });
}

exports.social = function(req, res) {
  res.render('social', {
    title: 'Social'
  });
}

exports.triggers = function(req, res) {
  res.render('triggers', {
    title: 'Triggers'
  });
}

exports.charities = function(req, res) {
  res.render('charities', {
    title: 'Charities'
  });
}

exports.tweets = function(req, res) {
  res.render('tweets', {
    title: 'Tweets'
  })
}

exports.leaderboard = function(req, res) {
  res.render('leaderboard', {
    title: 'Leaderboard'
  })
}
