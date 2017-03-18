const mongoose = require('../config/mongo');

const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var UserTriggerSchema = new Schema({
    triggerId: { ref: 'Trigger', type: ObjectId, index: true, required: true },
    amount: { type: Number, min: 0, required: true },
    charityId: { ref: 'Charity', type: ObjectId, required: true },
    active: { type: Boolean, default: false }
});

var UserSchema = new Schema({
    name: { type: String, trim: true },
    email: { type: String, required: true},
    phone: String,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    facebook: String,
    twitter: String,
    google: String,
    triggers: [UserTriggerSchema],
    confirm: Boolean,
    admin: {
        type: Boolean,
        default: false
    }
}, { toJSON: { virtuals: true }});

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        cb(err, isMatch);
    });
};

UserSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
    }
};

const User = mongoose.model('User', UserSchema);

module.exports = exports = User;
