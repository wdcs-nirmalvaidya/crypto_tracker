const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema({
  coin: {
    type: String,
    unique: true,
    required: true,
  },
  availableQuantity: {
    type: Number,
    default: 2000,
  },
});

module.exports = mongoose.model("Market", marketSchema);