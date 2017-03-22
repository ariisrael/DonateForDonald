const mongoose = require('../config/mongo');

const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ActivitySchema = new Schema({
    tweetId: ObjectId,
    amount: Number,
    date: { type: Date, default: new Date() },
}); 

const DonationSchema = new Schema({
    triggerId: ObjectId, 
    wager: Number,
    charity: ObjectId,
    active: Boolean,
    activity: [ActivitySchema],
});

const BalanceSchema = new Schema({
    charity: { ref: 'Charity', type: ObjectId }, 
    amount: { type: Number, required: true, default: 0, min: 0 },
});

const UserSchema = new Schema({
    name: { type: String, trim: true, },
    email: { type: String, required: true, },
    phone: String,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    facebook: String,
    twitter: String,
    google: String,
    donations: [DonationSchema],
    balances: [BalanceSchema],
    admin: { type: Boolean, default: false, },
    monthlyLimit: { type: Number, min: 0, },
    paymentToken: String,
    billingDate: Date,
}, { toJSON: { virtuals: true, }, });

UserSchema.pre('save', function (next) {
    const user = this;
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
    transform (doc, ret, options) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
    },
};

const User = mongoose.model('User', UserSchema);

module.exports = exports = User;
