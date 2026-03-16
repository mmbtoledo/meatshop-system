const express = require("express");
const router = express.Router();
const db = require("../db");

// GET LOSSES
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      l.LossID,
      l.ProductID,
      p.ProductName,
      l.Quantity,
      l.LossType,
      l.DateRecorded
    FROM losses l
    JOIN products p ON l.ProductID = p.ProductID
    ORDER BY l.LossID DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET losses error:", err);
      return res.status(500).json({ error: "Failed to fetch losses" });
    }

    res.json(result);
  });
});

// ADD LOSS AND REDUCE STOCK
router.post("/", (req, res) => {
  const { ProductID, Quantity, LossType, DateRecorded } = req.body;

  if (!ProductID || !Quantity || !LossType || !DateRecorded) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkStockSql = `
    SELECT StockQty FROM products WHERE ProductID = ?
  `;

  db.query(checkStockSql, [ProductID], (stockErr, stockResult) => {
    if (stockErr) {
      console.log("Loss stock check error:", stockErr);
      return res.status(500).json({ error: "Failed to check stock" });
    }

    if (stockResult.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const currentStock = stockResult[0].StockQty;

    if (Number(Quantity) > Number(currentStock)) {
      return res.status(400).json({ error: "Insufficient stock for loss recording" });
    }

    const lossSql = `
      INSERT INTO losses (ProductID, Quantity, LossType, DateRecorded)
      VALUES (?, ?, ?, ?)
    `;

    db.query(lossSql, [ProductID, Quantity, LossType, DateRecorded], (err) => {
      if (err) {
        console.log("POST loss error:", err);
        return res.status(500).json({ error: "Failed to record loss" });
      }

      const updateStockSql = `
        UPDATE products
        SET StockQty = StockQty - ?
        WHERE ProductID = ?
      `;

      db.query(updateStockSql, [Quantity, ProductID], (updateErr) => {
        if (updateErr) {
          console.log("Loss stock update error:", updateErr);
          return res.status(500).json({ error: "Loss recorded but failed to update stock" });
        }

        res.json({ message: "Loss recorded successfully" });
      });
    });
  });
});

module.exports = router;