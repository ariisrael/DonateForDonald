const models = require('../models');

const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');

const emailUtils = require('../utils/email')
const forgotEmail = emailUtils.forgotEmail
const changedEmail = emailUtils.changedEmail

const User = models.User;

exports.index = (req, res) => {
  User.find({}, (err, users) => {
    if(err) return console.error(err);
    res.json(users);
  });
}

exports.read = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err) return console.error(err);
    res.json(user);
  });
}

exports.update = (req, res) => {
  var id = req.params.id;
  var query = { _id: id };
  User.update(query, req.body, {}, (err, num) => {
    if(err) return console.error(err);
    res.json(num);
  });
}

/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

exports.ensureAuthorized = function(req, res, next) {
  var id = (req.params.id || req.params.userId);
  if (id === req.user.id || req.user.admin) {
    next();
  } else {
    res.redirect('/login');
  }
}

exports.userQuery = function(req, res, next) {
  if (!res.locals) {
    res.locals = {};
  }
  if (!res.locals.query) {
    res.locals.query = {}
  }
  if (!req.user.admin && req.user.id) {
    res.locals.query.userId = req.user.id
  }
  next();
}

exports.ensureAdmin = function(req, res, next) {
  if(req.user.admin) {
    next();
  } else {
    res.redirect('/login');
  }
}

/**
 * GET /login
 */
exports.loginGet = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken()
  });
};

/**
 * POST /login
 */
exports.loginPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (!user) {
      req.flash('error', info);
      return res.redirect('/login')
    }

    req.logIn(user, function(err) {
      console.log(user);
      if(!(user.paymentToken)) {
        res.redirect('/payment');
      } else {
        res.redirect('/triggers');
      }
    });
  })(req, res, next);
};

/**
 * GET /logout
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 */
exports.signupGet = function(req, res) {
  res.redirect('/login');
};

/**
 * POST /signup
 */
exports.signupPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();
  console.log(errors);

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/signup');
  }

  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
      return res.redirect('/signup');
    }
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err) {
      req.logIn(user, function(err) {
        res.redirect('/payment');
      });
    });
  });
};


exports.confirmEmail = function(req, res) {
  User.findOne({ confirmationToken: req.query.token })
    .where('confirmationTokenExpires').gt(new Date(Date.now()))
    .exec(function(err, user) {
      if (!user) {
        req.flash('error', { msg: 'Confirmation token is invalid or has expired.' });
        return res.redirect('/');
      }
      user.emailConfirmed = true
      user.confirmationToken = undefined
      user.confirmationTokenExpires = undefined
      user.save((err) => {
        if (err) {
          req.flash('error', { msg: 'Something went wrong, please try again.' });
        }
        if (!req.isAuthenticated()) {
          req.logIn(user, function(err) {
            res.redirect('/');
          });
        } else {
          res.redirect('/');
        }
      })
    });
}

/**
 * GET /account
 */
exports.accountGet = function(req, res) {
  res.render('account/profile', {
    title: 'My Account'
  });
};

/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = function(req, res, next) {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  }
  if (req.body.email) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
    req.assert('email', 'Emails must match').equals(req.body.confirm_email);
  }

  var errors = req.validationErrors();

  if (errors) {
    console.error(errors)
    req.flash('error', errors);
    return res.redirect('/settings');
  }

  User.findOne({ email: req.user.email }, function(err, user) {
    if (err) {
      req.flash('error', ['Something went wrong, please try again']);
      res.redirect('/settings')
    }
    if ('password' in req.body) {
      user.password = req.body.password;
    }
    if (req.body.email) {
      user.email = req.body.email
    }
    if (req.body.name) {
      user.name = req.body.name
    }
    user.save(function(err) {
      if ('password' in req.body) {
        req.flash('success', { msg: 'Your password has been changed.' });
      } else if (err && err.code === 11000) {
        req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
      } else {
        req.flash('success', { msg: 'Your profile information has been updated.' });
      }
      res.redirect('/settings');
    });
  });
};

/**
 * DELETE /account
 */
exports.accountDelete = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    req.logout();
    req.flash('info', { msg: 'Your account has been permanently deleted.' });
    res.redirect('/');
  });
};

exports.destroy = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    req.logout();
    req.flash('info', { msg: 'Your account has been permanently deleted.' });
    res.redirect('/');
  });
};

exports.triggers = {
  index: (req, res) => {
    User.findOne({ _id: req.params.id }, 'triggers', (err, user) => {
      if(err) return console.error(err);
      res.json(user.triggers);
    });
  },
  create: (req, res) => {
    User.findById({ _id: req.params.id }, (err, user) => {
      if(err) return console.error(err);
      user.triggers.push(req.body);
      user.save((err) => {
        if(err) return console.error(err);
      });
    });
  },
  update: (req, res) => {
    User.findById(req.params.userId, (err, user) => {
      var found = false;
      var i = 0;
      while(!found) {
        if(user.triggers[i].triggerId === req.params.triggerId) {
          found = true;
        } else {
          i++;
        }
      }
      var removed = user.triggers.splice(i, i + 1)[0];
      var newObj = Object.assign({}, removed);
      for(key in req.body) {
        newObj[key] = req.body[key];
      }
      user.triggers.push(newObj);
      user.save((err) => {
        if(err) return console.error(err);
      });
    });
  },
  destroy: (req, res) => {
    User.findById(req.params.userId, (err, user) => {
      if(err) return console.error(err);
      user.triggers.filter((t) => {
        if(t.triggerId === req.params.triggerId) {
          return false;
        }
      });
      user.save((err) => {
        if(err) console.error(err);
      })
    });
  },
  read: (req, res) => {
    User.findById(req.params.userId, (err, user) => {
      user.triggers.forEach((t) => {
        if(t.triggerId === req.params.triggerId) {
          return res.json(t);
        }
      });
      res.send();
    });
  }
}

/**
 * GET /unlink/:provider
 */
exports.unlink = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    switch (req.params.provider) {
      case 'facebook':
        user.facebook = undefined;
        break;
      case 'google':
        user.google = undefined;
        break;
      case 'twitter':
        user.twitter = undefined;
        break;
      default:
        req.flash('error', { msg: 'Invalid OAuth Provider' });
        return res.redirect('/settings');
    }
    user.save(function(err) {
      req.flash('success', { msg: 'Your account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /forgot
 */
exports.forgotGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', { msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      forgotEmail(user.name || user.email, user.email, user.passwordResetToken, function(err, data) {
        if (err) console.error(err)
        res.redirect('/forgot')
      })
    }
  ]);
};

/**
 * GET /reset
 */
exports.resetGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User.findOne({ passwordResetToken: req.query.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/reset');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset
 */
exports.resetPost = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User.findOne({ passwordResetToken: req.query.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      changedEmail(user.name || user.email, user.email, function(err, data) {
        if (err) console.log(err)
        res.redirect('/settings')
      })
    }
  ]);
};
