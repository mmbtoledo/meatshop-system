const express = require("express");
const router = express.Router();
const db = require("../db");

// =======================
// GET EXPENSES
// =======================
router.get("/", (req, res) => {
  const sql = `
    SELECT * FROM expenses
    ORDER BY ExpenseID DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET expenses error:", err);
      return res.status(500).json({ error: "Failed to fetch expenses" });
    }

    res.json(result);
  });
});

// =======================
// ADD EXPENSE (FIXED VALIDATION)
// =======================
router.post("/", (req, res) => {
  const { ExpenseDate, Description, Amount } = req.body;

  // REQUIRED CHECK
  if (!ExpenseDate || !Description || Amount === undefined || Amount === "") {
    return res.status(400).json({ error: "All fields are required" });
  }

  const amount = parseFloat(Amount);

  // VALID NUMBER
  if (isNaN(amount)) {
    return res.status(400).json({
      error: "Amount must be a valid number"
    });
  }

  // BLOCK ZERO / NEGATIVE
  if (amount <= 0) {
    return res.status(400).json({
      error: "Amount must be greater than 0"
    });
  }

  const sql = `
    INSERT INTO expenses (ExpenseDate, Description, Amount)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [ExpenseDate, Description, amount], (err) => {
    if (err) {
      console.log("POST expense error:", err);
      return res.status(500).json({ error: "Failed to add expense" });
    }

    res.json({ message: "Expense added successfully" });
  });
});

module.exports = router;