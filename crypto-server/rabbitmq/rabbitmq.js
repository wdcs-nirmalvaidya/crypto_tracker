const amqp = require("amqplib");

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertQueue("trade_queue");

    console.log("✅ RabbitMQ Connected");
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
  }
};

const publishToQueue = (data) => {
  if (!channel) {
    console.log("❌ RabbitMQ channel not ready");
    return;
  }

  console.log("📤 Sending to queue:", data);

  channel.sendToQueue(
    "trade_queue",
    Buffer.from(JSON.stringify(data))
  );
};

module.exports = {
  connectRabbitMQ,
  publishToQueue,
};