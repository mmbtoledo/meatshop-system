const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all products with category name
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      p.ProductID,
      p.ProductName,
      p.CurrentPrice,
      p.StockQty,
      p.CategoryID,
      c.CategoryName
    FROM products p
    LEFT JOIN categories c ON p.CategoryID = c.CategoryID
    ORDER BY p.ProductID DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch products error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.json(results);
  });
});

// ADD product
router.post("/", (req, res) => {
  const { ProductName, CurrentPrice, StockQty, CategoryID } = req.body;

  if (!ProductName || !ProductName.trim()) {
    return res.status(400).json({ message: "Product name is required." });
  }

  if (CurrentPrice === "" || CurrentPrice === null || CurrentPrice === undefined) {
    return res.status(400).json({ message: "Current price is required." });
  }

  if (StockQty === "" || StockQty === null || StockQty === undefined) {
    return res.status(400).json({ message: "Stock quantity is required." });
  }

  if (!CategoryID) {
    return res.status(400).json({ message: "Category is required." });
  }

  const sql = `
    INSERT INTO products (ProductName, CurrentPrice, StockQty, CategoryID)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [ProductName.trim(), CurrentPrice, StockQty, CategoryID],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Product already exists." });
        }

        console.error("Insert product error:", err);
        return res.status(500).json({ message: "Database error." });
      }

      res.status(201).json({ message: "Product added successfully." });
    }
  );
});

// UPDATE product
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { ProductName, CurrentPrice, StockQty, CategoryID } = req.body;

  if (!ProductName || !ProductName.trim()) {
    return res.status(400).json({ message: "Product name is required." });
  }

  if (CurrentPrice === "" || CurrentPrice === null || CurrentPrice === undefined) {
    return res.status(400).json({ message: "Current price is required." });
  }

  if (StockQty === "" || StockQty === null || StockQty === undefined) {
    return res.status(400).json({ message: "Stock quantity is required." });
  }

  if (!CategoryID) {
    return res.status(400).json({ message: "Category is required." });
  }

  const sql = `
    UPDATE products
    SET ProductName = ?, CurrentPrice = ?, StockQty = ?, CategoryID = ?
    WHERE ProductID = ?
  `;

  db.query(
    sql,
    [ProductName.trim(), CurrentPrice, StockQty, CategoryID, id],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Product already exists." });
        }

        console.error("Update product error:", err);
        return res.status(500).json({ message: "Database error." });
      }

      res.json({ message: "Product updated successfully." });
    }
  );
});

// DELETE product
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE ProductID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete product error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.json({ message: "Product deleted successfully." });
  });
});

module.exports = router;