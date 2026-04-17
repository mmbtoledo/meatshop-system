const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "loviers_secret_key";

// LOGIN
router.post("/login", (req, res) => {
  const { Username, Password } = req.body;

  console.log("LOGIN INPUT:", req.body);

  const sql = `
    SELECT * FROM users 
    WHERE Username = ? 
    AND Password = ?
  `;

  db.query(sql, [Username, Password], (err, result) => {
    if (err) {
      console.log("Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }

    console.log("RESULT:", result);

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result[0];

    if (user.isActive === 0) {
      return res.status(403).json({
        error: "Account is deactivated"
      });
    }

    // SAVE LOGIN LOG
    db.query(
      "INSERT INTO activity_logs (UserID) VALUES (?)",
      [user.UserID]
    );

    const token = jwt.sign(
      {
        UserID: user.UserID,
        Username: user.Username,
        Role: user.Role
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });
  });
});

module.exports = router;