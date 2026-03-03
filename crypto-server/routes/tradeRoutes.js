const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Market = require("../models/Market");
const { publishToQueue } = require("../rabbitmq/rabbitmq");

/* ================= CONSTANTS ================= */
const MAX_BALANCE = 100000;
const MIN_BALANCE = 100;

/* ================= CREATE USER ================= */
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

/* ================= GET USER ================= */
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      balance: user.balance,
      portfolio: user.portfolio,
    });

  } catch (err) {
    console.error("GET USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpVerified = false;

    await user.save();

    console.log("🔥 OTP:", otp);

    return res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

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

    return res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ================= MARKET QUANTITY ================= */
router.get("/market-quantity/:coin", async (req, res) => {
  try {
    const { coin } = req.params;

    let market = await Market.findOne({ coin });

    if (!market) {
      market = await Market.create({
        coin,
        availableQuantity: 2000,
      });
    }

    return res.json({
      totalAvailableQuantity: market.availableQuantity,
    });

  } catch (error) {
    console.error("MARKET FETCH ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ================= BUY ================= */
router.post("/buy", async (req, res) => {
  try {
    const { userId, coin, price, quantity } = req.body;

    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price);

    if (!parsedQuantity || parsedQuantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpVerified) {
      return res.status(403).json({
        message: "OTP verification required",
      });
    }

    const totalCost = parsedPrice * parsedQuantity;

    if (user.balance < totalCost) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const order = await Order.create({
      userId,
      coin,
      type: "BUY",
      price: parsedPrice,
      quantity: parsedQuantity,
      status: "PENDING",
    });

    publishToQueue({
      orderId: order._id,
    });

    return res.json({
      message: "Buy order placed successfully",
      orderId: order._id,
    });

  } catch (err) {
    console.error("BUY ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ================= SELL ================= */
router.post("/sell", async (req, res) => {
  try {
    const { userId, coin, price, quantity } = req.body;

    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price);

    if (!parsedQuantity || parsedQuantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpVerified) {
      return res.status(403).json({
        message: "OTP verification required",
      });
    }

    const existingCoin = user.portfolio.find(c => c.coin === coin);

    if (!existingCoin || existingCoin.quantity < parsedQuantity) {
      return res.status(400).json({
        message: "Not enough coins to sell",
      });
    }

    const order = await Order.create({
      userId,
      coin,
      type: "SELL",
      price: parsedPrice,
      quantity: parsedQuantity,
      status: "PENDING",
    });

    publishToQueue({
      orderId: order._id,
    });

    return res.json({
      message: "Sell order placed successfully",
      orderId: order._id,
    });

  } catch (err) {
    console.error("SELL ERROR:", err);
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

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (type === "add") {
      const remainingLimit = MAX_BALANCE - user.balance;

      if (parsedAmount > remainingLimit) {
        return res.status(400).json({
          message: `You can only add ${remainingLimit}`,
        });
      }

      user.balance += parsedAmount;
    }

    if (type === "subtract") {
      if (user.balance - parsedAmount < MIN_BALANCE) {
        return res.status(400).json({
          message: `Minimum balance must remain ${MIN_BALANCE}`,
        });
      }

      user.balance -= parsedAmount;
    }

    await user.save();

    return res.json({
      message:
        type === "add"
          ? "Money added successfully"
          : "Money deducted successfully",
      balance: user.balance,
    });

  } catch (err) {
    console.error("UPDATE BALANCE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;