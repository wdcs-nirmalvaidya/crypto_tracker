const pool = require("../db");

exports.getExchanges = async (req, res) => {
  const result = await pool.query("SELECT * FROM exchanges ORDER BY id DESC");
  res.json(result.rows);
};

exports.createExchange = async (req, res) => {
  const { name, country, url, image } = req.body;

  const result = await pool.query(
    "INSERT INTO exchanges (name, country, url, image) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, country, url, image]
  );

  res.json(result.rows[0]);
};

exports.updateExchange = async (req, res) => {
  const { name, country, url, image } = req.body;

  const result = await pool.query(
    "UPDATE exchanges SET name=$1, country=$2, url=$3, image=$4 WHERE id=$5 RETURNING *",
    [name, country, url, image, req.params.id]
  );

  res.json(result.rows[0]);
};

exports.deleteExchange = async (req, res) => {
  await pool.query("DELETE FROM exchanges WHERE id=$1", [req.params.id]);
  res.json({ message: "Exchange deleted" });
};
