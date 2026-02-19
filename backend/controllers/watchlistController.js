const pool = require("../db");

/* ---------------- GET WATCHLIST (WITH SEARCH) ---------------- */
exports.getWatchlist = async (req, res) => {
  try {
    const { search } = req.query;

    let query = `
      SELECT coins.*
      FROM watchlist
      INNER JOIN coins ON watchlist.coin_id = coins.id
    `;

    let values = [];

    if (search) {
      query += ` WHERE coins.name ILIKE $1`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY watchlist.id DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("GET WATCHLIST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------------- ADD TO WATCHLIST ---------------- */
exports.addToWatchlist = async (req, res) => {
  const { coin_id } = req.body;

  if (!coin_id) {
    return res.status(400).json({ error: "coin_id is required" });
  }

  try {
    await pool.query(
      `
      INSERT INTO watchlist (coin_id)
      VALUES ($1)
      ON CONFLICT (coin_id) DO NOTHING
      `,
      [coin_id]
    );

    res.json({ message: "Added to watchlist" });
  } catch (err) {
    console.error("POST WATCHLIST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ---------------- REMOVE FROM WATCHLIST ---------------- */
exports.removeFromWatchlist = async (req, res) => {
  const { coin_id } = req.params;

  try {
    await pool.query(
      "DELETE FROM watchlist WHERE coin_id = $1",
      [coin_id]
    );

    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    console.error("DELETE WATCHLIST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};
