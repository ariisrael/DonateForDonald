const mongoose = require('../config/mongo');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true },
  picture: String,
  phone: String,
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  facebook: String,
  twitter: String,
  google: String,
  admin: { type: Boolean, default: false },
  monthlyLimit: { type: Number, min: 0 },
  paymenttoken: String,
  billDate: Date,
  notification: Boolean,
}, { toJSON: { virtuals: true } });

UserSchema.pre('save', (next) => {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, null, (err, hash) => { // eslint-disable-line no-shadow
      user.password = hash;
      next();
    });
  });
  return true;
});

UserSchema.methods.comparePassword = (password, cb) => {
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
