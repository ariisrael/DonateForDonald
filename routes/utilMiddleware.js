module.exports.returnJSON = function(req, res, next) {
  res.locals.returnJSON = true;
  next();
}
