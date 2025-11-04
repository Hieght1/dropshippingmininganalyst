const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  fullname: { type: String },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please enter an email'],
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  approve: { type: String },
  withApprove: { type: String },
  tel: { type: String },
  currency: { type: String },
  account: { type: String, default: "Basic" },
  trade_pro: { type: Number, default: 0 },
  country: { type: String },
  postal: { type: String, default: "postal code" },
  address: { type: String, default: "your address" },
  city: { type: String, default: "your city" },
  password: { type: String },
  image: { type: String },
  balance: { type: String, default: "0.00" },
  pending: { type: String, default: "0.00" },
  verifiedStatus: { type: String, default: 'Account not yet Verified!' },
  bonus: { type: String, default: "0.00" },
  widthdrawBalance: { type: String, default: "0.00" },
  profit: { type: String, default: "0.00" },
  lastDeposit: { type: String, default: "0.00" },
  totalDeposit: { type: String, default: "0.00" },
  totalWidthdraw: { type: String, default: "0" },
  Signal: { type: [mongoose.Schema.Types.ObjectId], ref: 'signal' },
  insurances: { type: [mongoose.Schema.Types.ObjectId], ref: 'insurance' },
  upgrades: { type: [mongoose.Schema.Types.ObjectId], ref: 'upgrade' },
  verified: { type: [mongoose.Schema.Types.ObjectId], ref: 'verify' },
  deposits: { type: [mongoose.Schema.Types.ObjectId], ref: 'deposit' },
  widthdraws: { type: [mongoose.Schema.Types.ObjectId], ref: 'widthdraw' },
  role: { type: Number, default: 0 },
  // ----- inside userSchema (add at the bottom, before timestamps) -----
_balanceDisplayStart: { type: String, default: null },
_balanceDisplayTarget: { type: String, default: null },
_balanceDisplayAt:     { type: Number, default: null },

_profitDisplayStart: { type: String, default: null },
_profitDisplayTarget: { type: String, default: null },
_profitDisplayAt:    { type: Number, default: null },
}, { timestamps: true });

// Static login method (plain text comparison)
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    if (password === user.password) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);
module.exports = User;