const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
