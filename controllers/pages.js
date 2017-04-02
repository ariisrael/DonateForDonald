/**
 * GET /
 */



exports.landing = function(req, res) {
  if(req.user) {
      res.render('landing', {
    title: 'Home',
        email: (req.user.email) ? req.user.email : null,
    picture: (req.user.picture) ? req.user.picture : "https://myspace.com/common/images/user.png",
    name: (req.user.name) ? req.user.name : null,
  });
  } else {
  res.render('landing', {
    title: 'Home',
        email: null,
    picture: "https://myspace.com/common/images/user.png",
    name:  null,
  });
  }
};

exports.payment = function(req, res) {
  res.render('payment', {
    title: 'Payment',
    email: (req.user.email) ? req.user.email : null,
    picture: (req.user.picture) ? req.user.picture : "https://myspace.com/common/images/user.png",
    name: (req.user.name) ? req.user.name : null,
    csrfToken: req.csrfToken()
  });
}

exports.notifications = function(req, res) {
  res.render('notifications', {
    title: 'Notifications'
  });
}

exports.contact = function(req, res) {
  res.render('contact', {
    title: 'Contact',
    csrfToken: req.csrfToken()
  });
}

exports.reset = function(req, res) {
  res.render('reset', {
    title: 'Reset'
  });
}

exports.settings = function(req, res) {
 if(req.user) {
      res.render('settings', {
    title: 'Settings',
        email: (req.user.email) ? req.user.email : null,
    picture: (req.user.picture) ? req.user.picture : "https://myspace.com/common/images/user.png",
    name: (req.user.name) ? req.user.name : null,
  });
  } else {
  res.render('settings', {
    title: 'Settings',
        email: null,
    picture: "https://myspace.com/common/images/user.png",
    name:  null,
  });
  }
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
