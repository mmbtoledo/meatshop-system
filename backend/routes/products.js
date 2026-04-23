const express = require("express");
const router = express.Router();
const db = require("../db");

// =======================
// GET ALL PRODUCTS
// =======================
router.get("/", (req, res) => {
  console.log("✅ UPDATED PRODUCTS ROUTE RUNNING");

  const sql = `
  SELECT 
    ROW_NUMBER() OVER (ORDER BY p.ProductID DESC) AS ProductID,
    p.ProductID AS RealProductID,
    p.ProductName,
    p.CurrentPrice,
    p.StockQty,
    c.CategoryName,
    p.CategoryID
  FROM products p
  LEFT JOIN categories c ON p.CategoryID = c.CategoryID
  ORDER BY p.ProductID DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// =======================
// ADD OR UPDATE PRODUCT
// =======================
router.post("/", (req, res) => {
  let { ProductName, CurrentPrice, StockQty, CategoryID } = req.body;

  // 🔥 REQUIRED FIELDS CHECK
  if (!ProductName || !CurrentPrice || !StockQty || !CategoryID) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // 🔥 NEW VALIDATION (CRITICAL)
  if (
    isNaN(CurrentPrice) ||
    Number(CurrentPrice) <= 0 ||
    isNaN(StockQty) ||
    Number(StockQty) <= 0
  ) {
    return res.status(400).json({
      message: "Invalid input. Price and Stock must be numbers greater than 0.",
    });
  }

  // normalize input 🔥
  ProductName = ProductName.trim().toLowerCase();

  const sql = `
    INSERT INTO products (ProductName, CurrentPrice, StockQty, CategoryID)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      StockQty = StockQty + VALUES(StockQty),
      CurrentPrice = VALUES(CurrentPrice),
      CategoryID = VALUES(CategoryID)
  `;

  db.query(sql, [ProductName, CurrentPrice, StockQty, CategoryID], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error." });
    }

    res.json({ message: "Product added or updated successfully." });
  });
});

// =======================
// UPDATE PRODUCT (EDIT)
// =======================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  let { ProductName, CurrentPrice, StockQty, CategoryID } = req.body;

  // 🔥 OPTIONAL: VALIDATION FOR UPDATE TOO (recommended)
  if (
    isNaN(CurrentPrice) ||
    Number(CurrentPrice) <= 0 ||
    isNaN(StockQty) ||
    Number(StockQty) <= 0
  ) {
    return res.status(400).json({
      message: "Invalid input. Price and Stock must be numbers greater than 0.",
    });
  }

  ProductName = ProductName.trim().toLowerCase();

  const sql = `
    UPDATE products
    SET ProductName = ?, CurrentPrice = ?, StockQty = ?, CategoryID = ?
    WHERE ProductID = ?
  `;

  db.query(sql, [ProductName, CurrentPrice, StockQty, CategoryID, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Update failed." });
    }

    res.json({ message: "Product updated successfully." });
  });
});

// =======================
// DELETE
// =======================
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM products WHERE ProductID = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed." });
    res.json({ message: "Deleted successfully." });
  });
});

module.exports = router;

// =======================
// (IGNORE THIS - FRONTEND FUNCTION)
// =======================
function addProduct() {
  const ProductName = document.getElementById("productName").value;
  const CurrentPrice = document.getElementById("price").value;
  const StockQty = document.getElementById("stock").value;
  const CategoryID = document.getElementById("category").value;

  fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ProductName,
      CurrentPrice,
      StockQty,
      CategoryID,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      loadProducts();
    })
    .catch(() => {
      alert("Something went wrong.");
    });
}