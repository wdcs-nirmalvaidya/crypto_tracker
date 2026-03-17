const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());

// --- JWT Auth Middleware ---
const authMiddleware = (req, res, next) => {
    // Exclude public routes
    const publicPaths = ["/health", "/api/auth/login", "/api/auth/signup"];
    if (publicPaths.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Health check (Public)
app.get("/health", (req, res) => {
    res.json({ status: "API Gateway is running" });
});

// Apply JWT protection to everything below this line
app.use(authMiddleware);

// Proxy Rules (Preserve full paths by using pathFilter)
app.use(createProxyMiddleware({
    target: process.env.BACKEND_URL,
    changeOrigin: true,
    pathFilter: ["/api/auth", "/api/coins", "/api/exchanges", "/api/watchlist"],
}));

app.use(createProxyMiddleware({
    target: process.env.CRYPTO_SERVER_URL,
    changeOrigin: true,
    pathFilter: ["/api/trade"],
}));

// Socket.io Proxy (Handles WebSocket upgrades)
app.use("/socket.io", createProxyMiddleware({
    target: process.env.BACKEND_URL,
    changeOrigin: true,
    ws: true,
}));

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running at http://localhost:${PORT}`);
});
