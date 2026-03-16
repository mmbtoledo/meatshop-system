const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "loviers_secret_key";

// LOGIN
router.post("/login", (req, res) => {
  const { Username, Password } = req.body;

  const sql = `
    SELECT * FROM users
    WHERE Username = ? AND Password = ?
  `;

  db.query(sql, [Username, Password], (err, result) => {
    if (err) {
      console.log("Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result[0];

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
      user: {
        UserID: user.UserID,
        Username: user.Username,
        Role: user.Role
      }
    });
  });
});

// FORGOT PASSWORD
router.post("/forgot-password", (req, res) => {
  const { Username, NewPassword } = req.body;

  if (!Username || !NewPassword) {
    return res.status(400).json({ error: "Username and new password are required" });
  }

  const checkSql = `
    SELECT * FROM users
    WHERE Username = ?
  `;

  db.query(checkSql, [Username], (checkErr, checkResult) => {
    if (checkErr) {
      console.log("Forgot password check error:", checkErr);
      return res.status(500).json({ error: "Failed to verify user" });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateSql = `
      UPDATE users
      SET Password = ?
      WHERE Username = ?
    `;

    db.query(updateSql, [NewPassword, Username], (updateErr) => {
      if (updateErr) {
        console.log("Forgot password update error:", updateErr);
        return res.status(500).json({ error: "Failed to reset password" });
      }

      res.json({ message: "Password reset successful" });
    });
  });
});

module.exports = router;