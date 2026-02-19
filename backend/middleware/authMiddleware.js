const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const verified = jwt.verify(
      token.replace("Bearer ", ""),
      JWT_SECRET
    );

    req.user = verified;
    next();
  } catch {
    res.status(400).json({ error: "Invalid token" });
  }
};
