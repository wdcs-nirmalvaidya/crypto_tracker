const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db"); // 👈 import DB
const coinRoutes = require("./routes/coinRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const watchlistRoutes = require("./routes/watchlist");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- TEST ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ---------------- ROUTES ---------------- */
app.use("/api/coins", coinRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/auth", authRoutes);

/* ===================================================== */
/* 🔥 AUTO MARKET PRICE UPDATE EVERY 30 SECONDS */
/* ===================================================== */

const updateCoinPrices = async () => {
  try {
    const result = await pool.query("SELECT * FROM coins");

    for (const coin of result.rows) {
      const currentPrice = parseFloat(coin.current_price);

      // Random market movement between -5% to +5%
      const changePercent = (Math.random() * 10 - 5) / 100;

      const newPrice = currentPrice + currentPrice * changePercent;

      // Prevent negative price
      const safePrice = newPrice < 0 ? 1 : newPrice;

      await pool.query(
        "UPDATE coins SET current_price = $1 WHERE id = $2",
        [safePrice.toFixed(2), coin.id]
      );
    }

    console.log("📈 Coin prices updated");
  } catch (err) {
    console.error("MARKET UPDATE ERROR:", err);
  }
};

// Run every 30 seconds
setInterval(updateCoinPrices, 30000);

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
