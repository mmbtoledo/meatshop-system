const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL SALES
router.get("/", (req, res) => {
  const sql = `
    SELECT
      s.SalesID,
      s.SalesDate,
      sd.SalesDetailID,
      sd.ProductID,
      p.ProductName,
      sd.Quantity,
      sd.UnitPrice,
      sd.Subtotal
    FROM sales s
    JOIN sales_details sd ON s.SalesID = sd.SalesID
    JOIN products p ON sd.ProductID = p.ProductID
    ORDER BY s.SalesID DESC, sd.SalesDetailID ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET sales error:", err);
      return res.status(500).json({ error: "Failed to fetch sales" });
    }

    res.json(result);
  });
});

// ADD SALE WITH MULTIPLE PRODUCTS
router.post("/", (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "At least one sale item is required" });
  }

  const checkStockPromises = items.map((item) => {
    return new Promise((resolve, reject) => {
      const stockSql = `
        SELECT ProductID, ProductName, StockQty, CurrentPrice
        FROM products
        WHERE ProductID = ?
      `;

      db.query(stockSql, [item.ProductID], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return reject(new Error(`Product not found: ${item.ProductID}`));

        const product = result[0];

        if (Number(item.Quantity) > Number(product.StockQty)) {
          return reject(new Error(`Insufficient stock for ${product.ProductName}`));
        }

        resolve(product);
      });
    });
  });

  Promise.all(checkStockPromises)
    .then((productsData) => {
      const insertSaleSql = `
        INSERT INTO sales (SalesDate)
        VALUES (NOW())
      `;

      db.query(insertSaleSql, (saleErr, saleResult) => {
        if (saleErr) {
          console.log("Create sale error:", saleErr);
          return res.status(500).json({ error: "Failed to create sale" });
        }

        const salesID = saleResult.insertId;
        let completed = 0;
        let hasError = false;

        items.forEach((item, index) => {
          const product = productsData[index];
          const unitPrice = Number(product.CurrentPrice);
          const subtotal = Number(item.Quantity) * unitPrice;

          const insertDetailSql = `
            INSERT INTO sales_details
            (SalesID, ProductID, Quantity, UnitPrice, Subtotal)
            VALUES (?, ?, ?, ?, ?)
          `;

          db.query(
            insertDetailSql,
            [salesID, item.ProductID, item.Quantity, unitPrice, subtotal],
            (detailErr) => {
              if (detailErr && !hasError) {
                hasError = true;
                console.log("Insert sale detail error:", detailErr);
                return res.status(500).json({ error: "Failed to insert sale details" });
              }

              const updateStockSql = `
                UPDATE products
                SET StockQty = StockQty - ?
                WHERE ProductID = ?
              `;

              db.query(updateStockSql, [item.Quantity, item.ProductID], (stockErr) => {
                if (stockErr && !hasError) {
                  hasError = true;
                  console.log("Update stock error:", stockErr);
                  return res.status(500).json({ error: "Failed to update stock" });
                }

                completed++;

                if (completed === items.length && !hasError) {
                  res.json({
                    message: "Sale recorded successfully",
                    SalesID: salesID
                  });
                }
              });
            }
          );
        });
      });
    })
    .catch((err) => {
      console.log("Stock validation error:", err.message);
      res.status(400).json({ error: err.message });
    });
});

module.exports = router;