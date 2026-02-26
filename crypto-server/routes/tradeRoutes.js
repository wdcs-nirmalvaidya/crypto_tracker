const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* ================= PER-COIN MARKET SUPPLY ================= */
// Each coin has its own 2000 quantity
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
        balance: 1000000,
        portfolio: [],
        otpVerified: false,
      });

      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpVerified = false;

    await user.save();

    console.log("🔥 OTP:", otp);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.otpVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= BUY ================= */
router.post("/buy", async (req, res) => {
  try {
    const { userId, coin, price, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.otpVerified) {
      return res.status(403).json({
        message: "OTP verification required",
      });
    }

    // Initialize coin supply if first time
    if (!marketSupply[coin]) {
      marketSupply[coin] = 2000;
    }

    if (quantity > marketSupply[coin]) {
      return res.status(400).json({
        message: "Not enough market quantity available",
      });
    }

    const totalCost = price * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    user.balance -= totalCost;
    marketSupply[coin] -= quantity;

    const existingCoin = user.portfolio.find(
      (c) => c.coin === coin
    );

    if (existingCoin) {
      existingCoin.quantity += quantity;
    } else {
      user.portfolio.push({ coin, quantity });
    }

    user.otpVerified = false;
    await user.save();

    res.json({
      message: "Buy successful",
      balance: user.balance,
      portfolio: user.portfolio,
      marketQuantity: marketSupply[coin],
    });
  } catch (err) {
    console.error("BUY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= SELL ================= */
router.post("/sell", async (req, res) => {
  try {
    const { userId, coin, price, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.otpVerified) {
      return res.status(403).json({
        message: "OTP verification required",
      });
    }

    const existingCoin = user.portfolio.find(
      (c) => c.coin === coin
    );

    if (!existingCoin || existingCoin.quantity < quantity) {
      return res.status(400).json({
        message: "Not enough coins to sell",
      });
    }

    if (!marketSupply[coin]) {
      marketSupply[coin] = 2000;
    }

    const totalSell = price * quantity;

    existingCoin.quantity -= quantity;
    marketSupply[coin] += quantity;

    if (existingCoin.quantity === 0) {
      user.portfolio = user.portfolio.filter(
        (c) => c.coin !== coin
      );
    }

    user.balance += totalSell;
    user.otpVerified = false;

    await user.save();

    res.json({
      message: "Sell successful",
      balance: user.balance,
      portfolio: user.portfolio,
      marketQuantity: marketSupply[coin],
    });
  } catch (err) {
    console.error("SELL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET TRADE DATA ================= */
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      balance: user.balance,
      portfolio: user.portfolio,
    });
  } catch (err) {
    console.error("GET TRADE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET MARKET QUANTITY (PER COIN) ================= */
router.get("/market-quantity/:coin", (req, res) => {
  const { coin } = req.params;

  if (!marketSupply[coin]) {
    marketSupply[coin] = 2000;
  }

  res.json({
    totalAvailableQuantity: marketSupply[coin],
  });
});


router.post("/update-balance", async (req, res) => {
  try {
    const { userId, amount, type } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (type === "add") {
      user.balance += Number(amount);
    }

    if (type === "subtract") {
      if (user.balance < amount) {
        return res.status(400).json({
          message: "Insufficient balance",
        });
      }
      user.balance -= Number(amount);
    }

    await user.save();

    res.json({
      message: "Balance updated",
      balance: user.balance,
    });

  } catch (err) {
    console.error("UPDATE BALANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;