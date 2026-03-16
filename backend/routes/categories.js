const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL CATEGORIES
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY CategoryID DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }

    res.json(result);
  });
});

// ADD CATEGORY
router.post("/", (req, res) => {
  const { CategoryName } = req.body;

  if (!CategoryName) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const sql = "INSERT INTO categories (CategoryName) VALUES (?)";

  db.query(sql, [CategoryName], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to add category" });
    }

    res.json({ message: "Category added successfully" });
  });
});

// UPDATE CATEGORY
router.put("/:id", (req, res) => {
  const { CategoryName } = req.body;
  const categoryId = req.params.id;

  if (!CategoryName) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const sql = "UPDATE categories SET CategoryName = ? WHERE CategoryID = ?";

  db.query(sql, [CategoryName, categoryId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to update category" });
    }

    res.json({ message: "Category updated successfully" });
  });
});

// DELETE CATEGORY
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM categories WHERE CategoryID = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to delete category" });
    }

    res.json({ message: "Category deleted successfully" });
  });
});

module.exports = router;