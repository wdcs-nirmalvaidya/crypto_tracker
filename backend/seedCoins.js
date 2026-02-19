const pool = require("./db");

const coinNames = [
  "Bitcoin",
  "Ethereum",
  "Solana",
  "Cardano",
  "Polkadot",
  "Avalanche",
  "Litecoin",
  "Chainlink",
  "Dogecoin",
  "Tron",
  "Polygon",
  "Uniswap",
  "Cosmos",
  "NEAR",
  "Arbitrum",
  "Optimism",
  "Stellar",
  "Aptos",
  "Sui",
  "Tezos"
];

const coinLogos = [
  "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  "https://cryptologos.cc/logos/solana-sol-logo.png",
  "https://cryptologos.cc/logos/cardano-ada-logo.png",
  "https://cryptologos.cc/logos/polkadot-new-dot-logo.png"
];

const seedCoins = async () => {
  try {
    console.log("Seeding coins...");

    // 🔥 Clear old data (optional)
    await pool.query("DELETE FROM coins");

    for (let i = 1; i <= 50; i++) {
      const name =
        coinNames[Math.floor(Math.random() * coinNames.length)] + ` ${i}`;

      const image =
        coinLogos[Math.floor(Math.random() * coinLogos.length)];

      const price = (Math.random() * 50000 + 1).toFixed(2);

      await pool.query(
        `INSERT INTO coins (name, image, current_price)
         VALUES ($1, $2, $3)`,
        [name, image, price]
      );
    }

    console.log("✅ 50 Coins Seeded Successfully 🚀");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedCoins();
