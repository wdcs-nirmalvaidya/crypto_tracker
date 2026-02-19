const pool = require("../db");

/* ---------------- GET ALL (WITH SEARCH) ---------------- */
exports.getExchanges = async (req, res) => {
  try {
    const { search } = req.query;

    let query = "SELECT * FROM exchanges";
    let values = [];

    if (search) {
      query += " WHERE name ILIKE $1";
      values.push(`%${search}%`);
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("GET EXCHANGES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- CREATE ---------------- */
exports.createExchange = async (req, res) => {
  try {
    const {
      name,
      image,
      year_established,
      trust_score,
      trade_volume_24h_btc,
      trust_score_rank,
    } = req.body;

    // Validation
    if (!name || !image) {
      return res.status(400).json({
        message: "Name and image are required",
      });
    }

    if (String(year_established).length !== 4) {
      return res.status(400).json({
        message: "Year must be 4 digits",
      });
    }

    const result = await pool.query(
      `INSERT INTO exchanges 
       (name, image, year_established, trust_score, trade_volume_24h_btc, trust_score_rank)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        image,
        year_established,
        trust_score,
        trade_volume_24h_btc,
        trust_score_rank,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CREATE EXCHANGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- UPDATE ---------------- */
exports.updateExchange = async (req, res) => {
  try {
    const {
      name,
      image,
      year_established,
      trust_score,
      trade_volume_24h_btc,
      trust_score_rank,
    } = req.body;

    const result = await pool.query(
      `UPDATE exchanges SET
        name = $1,
        image = $2,
        year_established = $3,
        trust_score = $4,
        trade_volume_24h_btc = $5,
        trust_score_rank = $6
       WHERE id = $7
       RETURNING *`,
      [
        name,
        image,
        year_established,
        trust_score,
        trade_volume_24h_btc,
        trust_score_rank,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Exchange not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE EXCHANGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- DELETE ---------------- */
exports.deleteExchange = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM exchanges WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "Exchange deleted" });
  } catch (err) {
    console.error("DELETE EXCHANGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET BY ID ---------------- */
exports.getExchangeById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM exchanges WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Exchange not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET EXCHANGE BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
