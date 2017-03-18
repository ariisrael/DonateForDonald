var app = require('../index')

require('./session')

// this is our generic middleware that's applied to everything
app.use(function (req, res, next) {
  if (!res.locals) {
    res.locals = {};
  }
  res.locals.env = process.env.NODE_ENV
  next()
})

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
