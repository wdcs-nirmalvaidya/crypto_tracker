const express = require("express");
const router = express.Router();
const pool = require("../db");

/* ===============================
   GET WATCHLIST
================================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT coins.*
      FROM watchlist
      INNER JOIN coins ON watchlist.coin_id = coins.id
      ORDER BY watchlist.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("GET WATCHLIST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   ADD TO WATCHLIST
================================= */
router.post("/", async (req, res) => {
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
});

/* ===============================
   REMOVE FROM WATCHLIST
================================= */
router.delete("/:coin_id", async (req, res) => {
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
});

module.exports = router;
