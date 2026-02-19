const pool = require("./db");

const exchangeNames = [
  "Binance",
  "Coinbase",
  "Kraken",
  "KuCoin",
  "Bitfinex",
  "Bybit",
  "Gate.io",
  "OKX",
  "Huobi",
  "Bitstamp",
  "Gemini",
  "MEXC",
  "Crypto.com",
  "Bittrex",
  "BitMart",
  "Upbit",
  "LBank",
  "Bitget",
  "Phemex",
  "Deribit"
];

const exchangeLogos = [
  "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  "https://cryptologos.cc/logos/coinbase-logo.png",
  "https://cryptologos.cc/logos/kraken-logo.png",
  "https://cryptologos.cc/logos/okb-okb-logo.png",
  "https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png"
];

const seedExchanges = async () => {
  try {
    console.log("Seeding exchanges...");

    // 🔥 Clear old data (optional)
    await pool.query("DELETE FROM exchanges");

    for (let i = 1; i <= 50; i++) {
      const name =
        exchangeNames[Math.floor(Math.random() * exchangeNames.length)] +
        ` ${i}`;

      const image =
        exchangeLogos[Math.floor(Math.random() * exchangeLogos.length)];

      const year = Math.floor(Math.random() * (2026 - 1995 + 1)) + 1995;

      const trustScore = Math.floor(Math.random() * 100);

      const volume = Math.floor(Math.random() * 1000000);

      const rank = i;

      await pool.query(
        `INSERT INTO exchanges 
        (name, image, year_established, trust_score, trade_volume_24h_btc, trust_score_rank)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, image, year, trustScore, volume, rank]
      );
    }

    console.log("✅ 50 Exchanges Seeded Successfully 🚀");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedExchanges();
