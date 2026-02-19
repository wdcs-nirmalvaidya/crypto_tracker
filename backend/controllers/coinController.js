const pool = require("../db");

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
