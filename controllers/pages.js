/**
 * GET /
 */
exports.index = function(req, res) {
  res.render('landing', {
    title: 'Home'
  });
};

exports.payment = function(req, res) {
  res.render('payment', {
    title: 'Payment'
  });
}

exports.login = function(req, res) {
  res.render('login', {
    title: 'Login'
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
