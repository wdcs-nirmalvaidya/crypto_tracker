const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    phone,
    password,
  } = req.body;

  try {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users 
      (first_name, last_name, username, email, phone, password)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id, username, email`,
      [
        firstName,
        lastName,
        username,
        email,
        phone,
        hashedPassword,
      ]
    );

    res.json({
      message: "Signup successful",
      user: newUser.rows[0],
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userResult = await pool.query(
      `SELECT * FROM users 
       WHERE username = $1 OR email = $1`,
      [usernameOrEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 🔥 ACCESS TOKEN (2 minutes for testing)
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "2m" }
    );

    // 🔥 REFRESH TOKEN (1 day)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    // Save refresh token in DB
    await pool.query(
      "UPDATE users SET refresh_token = $1 WHERE id = $2",
      [refreshToken, user.id]
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= REFRESH TOKEN ================= */
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND refresh_token = $2",
      [decoded.id, refreshToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "2m" } // testing
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.error("REFRESH TOKEN ERROR:", err);
    return res.status(403).json({
      message: "Refresh token expired",
    });
  }
});

module.exports = router;
