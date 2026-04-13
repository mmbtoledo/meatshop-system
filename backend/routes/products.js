const express = require("express");
const router = express.Router();
const db = require("../db");

// =======================
// GET ALL PRODUCTS
// =======================
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
      console.error("Fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// =======================
// ADD OR UPDATE PRODUCT
// =======================
router.post("/", (req, res) => {
  let { ProductName, CurrentPrice, StockQty, CategoryID } = req.body;

  if (!ProductName || !CurrentPrice || !StockQty || !CategoryID) {
    return res.status(400).json({ message: "All fields are required." });
  }

  ProductName = ProductName.trim();

  const sql = `
    INSERT INTO products (ProductName, CurrentPrice, StockQty, CategoryID)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      StockQty = StockQty + VALUES(StockQty),
      CurrentPrice = VALUES(CurrentPrice),
      CategoryID = VALUES(CategoryID)
  `;

  db.query(
    sql,
    [ProductName, CurrentPrice, StockQty, CategoryID],
    (err) => {
      if (err) {
        console.error("Insert/Update error:", err);
        return res.status(500).json({ message: "Database error." });
      }

      res.json({
        message: "Product added or stock updated successfully."
      });
    }
  );
});

// =======================
// UPDATE PRODUCT (EDIT)
// =======================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  let { ProductName, CurrentPrice, StockQty, CategoryID } = req.body;

  if (!ProductName || !CurrentPrice || !StockQty || !CategoryID) {
    return res.status(400).json({ message: "All fields are required." });
  }

  ProductName = ProductName.trim();

  // 🔍 check duplicate EXCEPT itself
  const checkSql = `
    SELECT * FROM products 
    WHERE LOWER(ProductName) = LOWER(?) 
    AND ProductID != ?
  `;

  db.query(checkSql, [ProductName, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        message: "Another product with this name already exists."
      });
    }

    const updateSql = `
      UPDATE products
      SET ProductName=?, CurrentPrice=?, StockQty=?, CategoryID=?
      WHERE ProductID=?
    `;

    db.query(
      updateSql,
      [ProductName, CurrentPrice, StockQty, CategoryID, id],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Update failed." });
        }

        res.json({ message: "Product updated successfully." });
      }
    );
  });
});

// =======================
// DELETE PRODUCT
// =======================
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM products WHERE ProductID = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Delete failed." });
    }

    res.json({ message: "Product deleted successfully." });
  });
});

module.exports = router;