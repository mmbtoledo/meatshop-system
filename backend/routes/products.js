const express = require("express");
const router = express.Router();
const db = require("../db");


// GET ALL PRODUCTS
router.get("/", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY ProductID DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    res.json(result);
  });
});


// GET SINGLE PRODUCT
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM products WHERE ProductID = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch product" });
    }

    res.json(result[0]);
  });
});


// ADD PRODUCT
router.post("/", (req, res) => {
  const { ProductName, CurrentPrice, StockQty } = req.body;

  if (!ProductName || CurrentPrice === "" || StockQty === "") {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    INSERT INTO products (ProductName, CurrentPrice, StockQty)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [ProductName, CurrentPrice, StockQty], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to add product" });
    }

    res.json({ message: "Product added successfully" });
  });
});


// UPDATE PRODUCT
router.put("/:id", (req, res) => {
  const { ProductName, CurrentPrice, StockQty } = req.body;
  const productId = req.params.id;

  if (!ProductName || CurrentPrice === "" || StockQty === "") {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    UPDATE products
    SET ProductName = ?, CurrentPrice = ?, StockQty = ?
    WHERE ProductID = ?
  `;

  db.query(sql, [ProductName, CurrentPrice, StockQty, productId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to update product" });
    }

    res.json({ message: "Product updated successfully" });
  });
});


// DELETE PRODUCT
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM products WHERE ProductID = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to delete product" });
    }

    res.json({ message: "Product deleted successfully" });
  });
});

module.exports = router;