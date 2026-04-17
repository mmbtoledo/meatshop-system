const express = require("express");
const router = express.Router();
const db = require("../db");

// GET USERS (ROLE BASED)
router.get("/", (req, res) => {
  const role = req.query.role;

  let sql = "SELECT UserID, Username, Email, Contact, Role, isActive FROM users";

  if (role === "Admin") {
    sql += " WHERE Role != 'Super Admin'";
  }

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ACTIVITY LOGS
router.get("/logs", (req, res) => {
  const sql = `
    SELECT u.Username, u.Email, u.Contact, l.LoginTime
    FROM activity_logs l
    JOIN users u ON l.UserID = u.UserID
    ORDER BY l.LoginTime DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// TOGGLE ACTIVE
router.put("/toggle/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    UPDATE users 
    SET isActive = NOT isActive 
    WHERE UserID = ?
  `;

  db.query(sql, [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Updated" });
  });
});

// DELETE (ONLY SUPER ADMIN SHOULD CALL THIS)
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM users WHERE UserID = ?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});

// CREATE USER
router.post("/", (req, res) => {
  const { Username, Password, Email, Contact, Role } = req.body;

  const sql = `
    INSERT INTO users (Username, Password, Email, Contact, Role, isActive)
    VALUES (?, ?, ?, ?, ?, 1)
  `;

  db.query(sql, [Username, Password, Email, Contact, Role], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User created" });
  });
});

module.exports = router;