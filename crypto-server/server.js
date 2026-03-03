const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { connectRabbitMQ } = require("./rabbitmq/rabbitmq"); // ✅ ADD THIS

const app = express();

app.use(express.json());
app.use(cors());

console.log("Starting trade server...");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// ✅ Connect RabbitMQ (STEP 3 ADDED HERE)
connectRabbitMQ();

// ✅ Register Trade Routes
app.use("/api/trade", require("./routes/tradeRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Trade server running");
});

app.listen(process.env.PORT, () => {
  console.log(`Trade Server running on port ${process.env.PORT}`);
});