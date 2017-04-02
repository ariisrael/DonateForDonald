var app = require('../index')

require('./session')

// this is our generic middleware that's applied to everything
app.use(function (req, res, next) {
  if (!res.locals) {
    res.locals = {};
  }
  res.locals.env = process.env.NODE_ENV
  if (req.user) {
    res.locals.user = {
      email: (req.user.email) ? req.user.email : null,
      picture: (req.user.picture) ? req.user.picture : "https://myspace.com/common/images/user.png",
      name: (req.user.name) ? req.user.name : null,
      admin: (req.user.admin) ? req.user.admin : null,
    }
  }

  // Setup a query
  res.locals.query = {}

  next()
})

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
