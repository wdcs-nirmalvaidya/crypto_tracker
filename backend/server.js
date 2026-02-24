const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const pool = require("./db");
const coinRoutes = require("./routes/coinRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const watchlistRoutes = require("./routes/watchlist");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);

/* ---------------- SOCKET SETUP ---------------- */

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

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



const updateCoinPrices = async () => {
  try {
    const result = await pool.query("SELECT * FROM coins");

    for (const coin of result.rows) {
      const currentPrice = parseFloat(coin.current_price);

      const changePercent = (Math.random() * 10 - 5) / 100;

      const newPrice = currentPrice + currentPrice * changePercent;

      const safePrice = newPrice < 0 ? 1 : newPrice;
      const finalPrice = parseFloat(safePrice.toFixed(2));

      await pool.query(
        "UPDATE coins SET current_price = $1 WHERE id = $2",
        [finalPrice, coin.id]
      );

      // 🔥 EMIT REAL-TIME UPDATE
      io.emit("priceUpdate", {
        coinId: coin.id,
        current_price: finalPrice,
        timestamp: Date.now(),
      });
    }

    console.log("📈 Prices updated & broadcasted");
  } catch (err) {
    console.error("MARKET UPDATE ERROR:", err);
  }
};

setInterval(updateCoinPrices, 30000);

/* ---------------- SOCKET CONNECTION ---------------- */

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

/* ---------------- 404 HANDLER ---------------- */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
