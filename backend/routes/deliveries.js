const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL DELIVERIES
router.get("/", (req, res) => {
  const sql = `
    SELECT
      d.DeliveryID,
      d.DeliveryDate,
      s.SupplierName,
      dd.DeliveryDetailID,
      p.ProductName,
      dd.Quantity,
      dd.CostPrice,
      dd.TotalCost
    FROM deliveries d
    JOIN suppliers s ON d.SupplierID = s.SupplierID
    JOIN delivery_details dd ON d.DeliveryID = dd.DeliveryID
    JOIN products p ON dd.ProductID = p.ProductID
    ORDER BY d.DeliveryID DESC, dd.DeliveryDetailID ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET deliveries error:", err);
      return res.status(500).json({ error: "Failed to fetch deliveries" });
    }

    res.json(result);
  });
});

// ADD DELIVERY WITH MULTIPLE PRODUCTS
router.post("/", (req, res) => {
  const { DeliveryDate, SupplierID, items } = req.body;

  // 🔥 REQUIRED
  if (!DeliveryDate || !SupplierID || !items || items.length === 0) {
    return res.status(400).json({ error: "Delivery date, supplier, and items are required" });
  }

  // 🔥 DATE VALIDATION (NO PAST)
  const today = new Date().toISOString().split("T")[0];
  if (DeliveryDate < today) {
    return res.status(400).json({
      error: "Delivery date cannot be in the past"
    });
  }

  // 🔥 ITEMS VALIDATION
  for (let item of items) {
    if (!item.ProductID || !item.Quantity || !item.CostPrice) {
      return res.status(400).json({
        error: "All delivery item fields are required"
      });
    }

    if (
      isNaN(item.Quantity) ||
      Number(item.Quantity) <= 0 ||
      isNaN(item.CostPrice) ||
      Number(item.CostPrice) <= 0
    ) {
      return res.status(400).json({
        error: "Quantity and Cost Price must be numbers greater than 0"
      });
    }
  }

  const insertDeliverySql = `
    INSERT INTO deliveries (DeliveryDate, SupplierID)
    VALUES (?, ?)
  `;

  db.query(insertDeliverySql, [DeliveryDate, SupplierID], (err, result) => {
    if (err) {
      console.log("INSERT delivery header error:", err);
      return res.status(500).json({ error: "Failed to create delivery" });
    }

    const deliveryId = result.insertId;
    let completed = 0;
    let hasError = false;

    items.forEach((item) => {
      const totalCost = Number(item.Quantity) * Number(item.CostPrice);

      const insertDetailSql = `
        INSERT INTO delivery_details
        (DeliveryID, ProductID, Quantity, CostPrice, TotalCost)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertDetailSql,
        [deliveryId, item.ProductID, item.Quantity, item.CostPrice, totalCost],
        (detailErr) => {
          if (detailErr && !hasError) {
            hasError = true;
            console.log("INSERT delivery detail error:", detailErr);
            return res.status(500).json({ error: "Failed to insert delivery details" });
          }

          const updateStockSql = `
            UPDATE products
            SET StockQty = StockQty + ?
            WHERE ProductID = ?
          `;

          db.query(updateStockSql, [item.Quantity, item.ProductID], (stockErr) => {
            if (stockErr && !hasError) {
              hasError = true;
              console.log("UPDATE stock error:", stockErr);
              return res.status(500).json({ error: "Failed to update product stock" });
            }

            completed++;

            if (completed === items.length && !hasError) {
              res.json({ message: "Delivery saved successfully" });
            }
          });
        }
      );
    });
  });
});

module.exports = router;