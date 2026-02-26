const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  balance: { type: Number, default: 10000 },
  portfolio: [
    {
      coin: String,
      quantity: Number
    }
  ],
  otp: String,
  otpExpiry: Date,
  otpVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);