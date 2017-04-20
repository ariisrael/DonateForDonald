const mongoose = require('../config/mongo');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const welcomeEmail = require('../utils/email').welcomeEmail

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true },
  picture: String,
  phone: String,
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  confirmationToken: String,
  confirmationTokenExpires: Date,
  emailConfirmed: { type: Boolean, default: false },
  facebook: String,
  twitter: String,
  twitterCreds: {
    accessToken: String,
    accessTokenSecret: String
  },
  google: String,
  social: { type: Boolean, default: false },
  skipSocial: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  monthlyLimit: { type: Number, min: 0 },
  paymentToken: String,
  billDate: Date,
  notification: Boolean,
}, { toJSON: { virtuals: true } });

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, null, (err, hash) => { // eslint-disable-line no-shadow
      user.password = hash;
      next();
    });
  });
  return true;
});

UserSchema.pre('save', function(next) {
  var user = this
  if (user.emailConfirmed || user.confirmationToken) {
    return next();
  }
  crypto.randomBytes(16, function(err, buf) {
    var token = buf.toString('hex');
    user.confirmationToken = token;
    user.confirmationTokenExpires = Date.now() + 86400000; // expire in 1 day
    var name = user.name
    if (!name) name = user.email
    welcomeEmail(name, user.email, token, (err, body) => {
      next()
    })
  });
  return true
});

UserSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => cb(err, isMatch));
};

UserSchema.options.toJSON = {
  transform(doc, ret) {
    delete ret.password; // eslint-disable-line no-param-reassign
    delete ret.passwordResetToken; // eslint-disable-line no-param-reassign
    delete ret.passwordResetExpires; // eslint-disable-line no-param-reassign
  },
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
