const express = require("express");
const cors = require("cors");
require("dotenv").config();

const coinRoutes = require("./routes/coinRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const watchlistRoutes = require("./routes/watchlist"); // ✅ ADD THIS

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api/coins", coinRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/watchlist", watchlistRoutes); // ✅ ADD THIS

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
