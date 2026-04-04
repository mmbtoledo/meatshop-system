const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all categories
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY CategoryID DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch categories error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.json(results);
  });
});

// ADD category
router.post("/", (req, res) => {
  const { CategoryName } = req.body;

  if (!CategoryName || !CategoryName.trim()) {
    return res.status(400).json({ message: "Category name is required." });
  }

  const sql = "INSERT INTO categories (CategoryName) VALUES (?)";

  db.query(sql, [CategoryName.trim()], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Category already exists." });
      }

      console.error("Insert category error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.status(201).json({ message: "Category added successfully." });
  });
});

// UPDATE category
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { CategoryName } = req.body;

  if (!CategoryName || !CategoryName.trim()) {
    return res.status(400).json({ message: "Category name is required." });
  }

  const sql = "UPDATE categories SET CategoryName = ? WHERE CategoryID = ?";

  db.query(sql, [CategoryName.trim(), id], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Category already exists." });
      }

      console.error("Update category error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.json({ message: "Category updated successfully." });
  });
});

// DELETE category
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM categories WHERE CategoryID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete category error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.json({ message: "Category deleted successfully." });
  });
});

module.exports = router;