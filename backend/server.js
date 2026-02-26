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

/* 🔥 Track connected users */
const connectedUsers = new Map();

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

/* ---------------- SOCKET CONNECTION ---------------- */

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;

  if (!userId) {
    console.log("⚠️ Anonymous socket rejected:", socket.id);
    socket.disconnect();
    return;
  }

  console.log(`🔌 User connected: ${userId}`);

  /* 🔥 If user already connected, disconnect old socket */
  if (connectedUsers.has(userId)) {
    const oldSocketId = connectedUsers.get(userId);
    const oldSocket = io.sockets.sockets.get(oldSocketId);

    if (oldSocket) {
      oldSocket.disconnect();
      console.log(`♻️ Previous socket disconnected for user ${userId}`);
    }
  }

  connectedUsers.set(userId, socket.id);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${userId}`);
    connectedUsers.delete(userId);
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