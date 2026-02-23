const pool = require("../db");

/* ---------------- PRICE HISTORY STORAGE (IN MEMORY) ---------------- */

const priceHistory = {};

/* ---------------- GET ALL (WITH SEARCH) ---------------- */
exports.getCoins = async (req, res) => {
  try {
    const { search } = req.query;

    let query = "SELECT * FROM coins";
    let values = [];

    if (search) {
      query += " WHERE name ILIKE $1";
      values.push(`%${search}%`);
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("GET COINS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET SINGLE COIN (LIVE SIMULATION) ---------------- */
exports.getCoinById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM coins WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Coin not found" });
    }

    let coin = result.rows[0];

    // 🔥 Simulate small live price change
    const randomChange = (Math.random() * 2 - 1).toFixed(2);
    const newPrice =
      Number(coin.current_price) + Number(randomChange);

    coin.current_price = Number(newPrice.toFixed(2));
    coin.change_24h = Number(randomChange);

    // 🔥 Store history
    if (!priceHistory[id]) {
      priceHistory[id] = [];
    }

    priceHistory[id].push({
      timestamp: Date.now(),
      price: coin.current_price,
    });

    // Keep only last 20 data points
    if (priceHistory[id].length > 20) {
      priceHistory[id].shift();
    }

    res.json(coin);
  } catch (err) {
    console.error("GET SINGLE COIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET PRICE HISTORY ---------------- */
exports.getCoinHistory = async (req, res) => {
  try {
    const { id } = req.params;

    res.json(priceHistory[id] || []);
  } catch (err) {
    console.error("GET HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- CREATE ---------------- */
exports.createCoin = async (req, res) => {
  try {
    const { name, current_price, image } = req.body;

    const result = await pool.query(
      "INSERT INTO coins (name, current_price, image) VALUES ($1,$2,$3) RETURNING *",
      [name, current_price, image]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("CREATE COIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- UPDATE ---------------- */
exports.updateCoin = async (req, res) => {
  try {
    const { name, current_price, image } = req.body;

    const result = await pool.query(
      "UPDATE coins SET name=$1, current_price=$2, image=$3 WHERE id=$4 RETURNING *",
      [name, current_price, image, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE COIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- DELETE ---------------- */
exports.deleteCoin = async (req, res) => {
  try {
    await pool.query("DELETE FROM coins WHERE id=$1", [
      req.params.id,
    ]);

    res.json({ message: "Coin deleted" });
  } catch (err) {
    console.error("DELETE COIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};