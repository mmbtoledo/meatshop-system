const express = require("express");
const router = express.Router();
const db = require("../db");

// =======================
// GET USERS (ROLE BASED)
// =======================
router.get("/", (req, res) => {
  const role = (req.query.role || "").toLowerCase().trim();

  let sql = `
    SELECT UserID, Username, Email, Contact, Role, isActive
    FROM users
  `;

  // Admin cannot see Super Admin
  if (role === "admin") {
    sql += " WHERE LOWER(Role) NOT LIKE '%super%'";
  }

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET users error:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(result);
  });
});

// =======================
// GET ACTIVITY LOGS (FIXED)
// =======================
router.get("/logs", (req, res) => {
  const sql = `
    SELECT 
      u.Username,
      u.Email,
      u.Contact,
      l.LoginTime
    FROM activity_logs l
    LEFT JOIN users u ON l.UserID = u.UserID
    ORDER BY l.LoginTime DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("🔥 FULL ERROR:", err); // 👈 shows real error in terminal
      return res.status(500).json({
        error: err.sqlMessage // 👈 sends real SQL error to browser
      });
    }

    res.json(result);
  });
});

// =======================
// CREATE USER
// =======================
router.post("/", (req, res) => {
  const { Username, Password, Email, Contact, Role, creatorRole } = req.body;

  // VALIDATION
  if (!Username || !Password || !Email || !Contact || !Role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!/^\d{11}$/.test(Contact)) {
    return res.status(400).json({
      message: "Contact must be exactly 11 digits."
    });
  }

  if (!/\S+@\S+\.\S+/.test(Email)) {
    return res.status(400).json({
      message: "Invalid email format."
    });
  }

  // ROLE PROTECTION
  if (Role.toLowerCase().includes("super") && creatorRole !== "super admin") {
    return res.status(403).json({
      message: "Only SuperAdmin can create SuperAdmin accounts."
    });
  }

  // DUPLICATE CHECK
  const checkSql = `
    SELECT * FROM users 
    WHERE LOWER(Username) = LOWER(?) 
    OR LOWER(Email) = LOWER(?)
  `;

  db.query(checkSql, [Username, Email], (checkErr, result) => {
    if (checkErr) {
      console.log("CHECK user error:", checkErr);
      return res.status(500).json({ message: "Database error." });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "User already exists (Username or Email already taken)."
      });
    }

    // INSERT USER
    const insertSql = `
      INSERT INTO users (Username, Password, Email, Contact, Role, isActive)
      VALUES (?, ?, ?, ?, ?, 1)
    `;

    db.query(
      insertSql,
      [Username, Password, Email, Contact, Role],
      (err) => {
        if (err) {
          console.log("CREATE user error:", err);
          return res.status(500).json({
            message: "Failed to create user."
          });
        }

        res.json({ message: "User created successfully." });
      }
    );
  });
});

// =======================
// TOGGLE ACTIVE
// =======================
router.put("/toggle/:id", (req, res) => {
  db.query(
    "UPDATE users SET isActive = NOT isActive WHERE UserID = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to update user." });
      }
      res.json({ message: "User status updated." });
    }
  );
});

// =======================
// DELETE USER
// =======================
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM users WHERE UserID = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete user." });
    }
    res.json({ message: "User deleted successfully." });
  });
});

module.exports = router;