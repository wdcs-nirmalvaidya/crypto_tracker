const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* ================= CONSTANTS ================= */
const MAX_BALANCE = 100000;
const MIN_BALANCE = 100;

/* ================= PER-COIN MARKET SUPPLY ================= */
let marketSupply = {};

/* ================= CREATE TRADE USER ================= */
router.post("/create-user", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        balance: MAX_BALANCE,
        portfolio: [],
        otpVerified: false,
      });

      await user.save();
    }

    return res.json(user);
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE BALANCE ================= */
router.post("/update-balance", async (req, res) => {
  try {
    const { userId, amount, type } = req.body;

    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!["add", "subtract"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ================= ADD MONEY ================= */
    if (type === "add") {

      const remainingLimit = MAX_BALANCE - user.balance;

      if (remainingLimit <= 0) {
        return res.status(400).json({
          message: "You cannot exceed 100000",
        });
      }

      if (parsedAmount > remainingLimit) {
        return res.status(400).json({
          message: `You can only add ${remainingLimit}`,
        });
      }

      user.balance += parsedAmount;
      await user.save();

      return res.json({
        message: "Money added successfully",
        balance: user.balance,
      });
    }

    /* ================= SUBTRACT MONEY ================= */
    if (type === "subtract") {

      if (user.balance < parsedAmount) {
        return res.status(400).json({
          message: "Insufficient balance",
        });
      }

      if (user.balance - parsedAmount < MIN_BALANCE) {
        return res.status(400).json({
          message: `Minimum balance must remain ${MIN_BALANCE}`,
        });
      }

      user.balance -= parsedAmount;
      await user.save();

      return res.json({
        message: "Money deducted successfully",
        balance: user.balance,
      });
    }

  } catch (err) {
    console.error("UPDATE BALANCE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;