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
   // SAVE LOGIN LOG (SAFE)
db.query(
  "INSERT INTO activity_logs (UserID) VALUES (?)",
  [user.UserID],
  (logErr) => {
    if (logErr) {
      console.log("LOG INSERT ERROR:", logErr);
    } else {
      console.log("LOGIN LOG SAVED");
    }
  }
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

// FORGOT PASSWORD (WITH OLD PASSWORD VERIFICATION)
router.post("/forgot-password", (req, res) => {
  const { Username, OldPassword, NewPassword } = req.body;

  if (!Username || !OldPassword || !NewPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // 🔍 CHECK USER + OLD PASSWORD
  const checkSql = `
    SELECT * FROM users 
    WHERE Username = ? AND Password = ?
  `;

  db.query(checkSql, [Username, OldPassword], (err, result) => {
    if (err) {
      console.log("Check error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    // ❌ USERNAME OR PASSWORD WRONG
    if (result.length === 0) {
      // Check if username exists separately
      db.query(
        "SELECT * FROM users WHERE Username = ?",
        [Username],
        (err2, userCheck) => {
          if (userCheck.length === 0) {
            return res.status(404).json({
              error: "This Username doesn't exist"
            });
          } else {
            return res.status(401).json({
              error: "Old password is incorrect"
            });
          }
        }
      );
      return;
    }

    // ✅ UPDATE PASSWORD
    const updateSql = `
      UPDATE users 
      SET Password = ? 
      WHERE Username = ?
    `;

    db.query(updateSql, [NewPassword, Username], (updateErr) => {
      if (updateErr) {
        console.log("Update error:", updateErr);
        return res.status(500).json({
          error: "Failed to update password"
        });
      }

      res.json({ message: "Password successfully updated" });
    });
  });
});

module.exports = router;