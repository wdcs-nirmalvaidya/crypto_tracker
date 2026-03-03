const amqp = require("amqplib");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Order = require("./models/Order");
const Market = require("./models/Market");

const startWorker = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected (Worker)");

    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const QUEUE = "trade_queue";

    await channel.assertQueue(QUEUE);

    console.log("🚀 Trade Worker Running...");

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;

      console.log("📥 Worker received message");

      const { orderId } = JSON.parse(msg.content.toString());

      console.log("Processing Order:", orderId);

      try {
        const order = await Order.findById(orderId);
        if (!order) {
          console.log("❌ Order not found");
          return channel.ack(msg);
        }

        const user = await User.findById(order.userId);
        if (!user) {
          console.log("❌ User not found");
          return channel.ack(msg);
        }

        let market = await Market.findOne({ coin: order.coin });

        if (!market) {
          market = await Market.create({
            coin: order.coin,
            availableQuantity: 2000,
          });
        }

        if (order.type === "BUY") {
          const totalCost = order.price * order.quantity;

          if (
            user.balance >= totalCost &&
            market.availableQuantity >= order.quantity
          ) {
            user.balance -= totalCost;
            market.availableQuantity -= order.quantity;

            const existingCoin = user.portfolio.find(
              c => c.coin === order.coin
            );

            if (existingCoin) {
              existingCoin.quantity += order.quantity;
            } else {
              user.portfolio.push({
                coin: order.coin,
                quantity: order.quantity,
              });
            }

            order.status = "COMPLETED";
            console.log("✅ BUY completed");
          } else {
            order.status = "FAILED";
            console.log("❌ BUY failed");
          }
        }

        if (order.type === "SELL") {
          const existingCoin = user.portfolio.find(
            c => c.coin === order.coin
          );

          if (
            existingCoin &&
            existingCoin.quantity >= order.quantity
          ) {
            existingCoin.quantity -= order.quantity;
            market.availableQuantity += order.quantity;

            if (existingCoin.quantity === 0) {
              user.portfolio = user.portfolio.filter(
                c => c.coin !== order.coin
              );
            }

            user.balance += order.price * order.quantity;
            order.status = "COMPLETED";
            console.log("✅ SELL completed");
          } else {
            order.status = "FAILED";
            console.log("❌ SELL failed");
          }
        }

        await user.save();
        await market.save();
        await order.save();

        channel.ack(msg);

      } catch (error) {
        console.error("Worker Processing Error:", error);
        channel.nack(msg);
      }
    });

  } catch (error) {
    console.error("Worker Startup Error:", error);
  }
};

startWorker();