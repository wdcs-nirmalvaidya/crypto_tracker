const pool = require("../db");

exports.getCoins = async (req, res) => {
  const result = await pool.query("SELECT * FROM coins ORDER BY id DESC");
  res.json(result.rows);
};

exports.createCoin = async (req, res) => {
  const { name, current_price, image } = req.body;

  const result = await pool.query(
    "INSERT INTO coins (name, current_price, image) VALUES ($1,$2,$3) RETURNING *",
    [name, current_price, image]
  );

  res.json(result.rows[0]);
};

exports.updateCoin = async (req, res) => {
  const { name, current_price, image } = req.body;

  const result = await pool.query(
    "UPDATE coins SET name=$1, current_price=$2, image=$3 WHERE id=$4 RETURNING *",
    [name, current_price, image, req.params.id]
  );

  res.json(result.rows[0]);
};

exports.deleteCoin = async (req, res) => {
  await pool.query("DELETE FROM coins WHERE id=$1", [req.params.id]);
  res.json({ message: "Coin deleted" });
};
