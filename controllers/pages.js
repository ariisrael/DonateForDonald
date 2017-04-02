/**
 * GET /
 */
exports.index = function(req, res) {
  res.render('landing', {
    title: 'Home'
  });
};

exports.payments = function(req, res) {
  res.render('payments', {
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