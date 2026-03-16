const express = require("express");
const router = express.Router();
const db = require("../db");

// SUMMARY
router.get("/summary", (req, res) => {
  const sql = `
    SELECT
      IFNULL((SELECT SUM(Subtotal) FROM sales_details), 0) AS TotalSales,
      IFNULL((SELECT SUM(AmountPaid) FROM payments), 0) AS TotalPayments,
      IFNULL((SELECT SUM(Amount) FROM expenses), 0) AS TotalExpenses,
      IFNULL((SELECT SUM(Quantity) FROM losses), 0) AS TotalLosses,
      IFNULL((SELECT COUNT(*) FROM products WHERE StockQty <= 5), 0) AS LowStockProducts
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Summary report error:", err);
      return res.status(500).json({ error: "Failed to generate summary report" });
    }

    const data = result[0] || {};

    res.json({
      TotalSales: Number(data.TotalSales || 0),
      TotalPayments: Number(data.TotalPayments || 0),
      TotalExpenses: Number(data.TotalExpenses || 0),
      TotalLosses: Number(data.TotalLosses || 0),
      LowStockProducts: Number(data.LowStockProducts || 0),
      NetProfit: Number(data.TotalSales || 0) - Number(data.TotalExpenses || 0)
    });
  });
});

// SALES BY PERIOD
router.get("/sales/:period", (req, res) => {
  const { period } = req.params;

  let groupSql = "";
  let labelSql = "";

  if (period === "daily") {
    labelSql = "DATE(s.SalesDate)";
    groupSql = "DATE(s.SalesDate)";
  } else if (period === "weekly") {
    labelSql = "CONCAT(YEAR(s.SalesDate), '-W', WEEK(s.SalesDate))";
    groupSql = "YEAR(s.SalesDate), WEEK(s.SalesDate)";
  } else if (period === "monthly") {
    labelSql = "DATE_FORMAT(s.SalesDate, '%Y-%m')";
    groupSql = "DATE_FORMAT(s.SalesDate, '%Y-%m')";
  } else if (period === "yearly") {
    labelSql = "YEAR(s.SalesDate)";
    groupSql = "YEAR(s.SalesDate)";
  } else {
    return res.status(400).json({ error: "Invalid period" });
  }

  const sql = `
    SELECT
      ${labelSql} AS Label,
      IFNULL(SUM(sd.Subtotal), 0) AS TotalSales
    FROM sales s
    JOIN sales_details sd ON s.SalesID = sd.SalesID
    GROUP BY ${groupSql}
    ORDER BY Label ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Sales period report error:", err);
      return res.status(500).json({ error: "Failed to generate sales report" });
    }

    res.json(result);
  });
});

// PAYMENTS BY PERIOD
router.get("/payments/:period", (req, res) => {
  const { period } = req.params;

  let groupSql = "";
  let labelSql = "";

  if (period === "daily") {
    labelSql = "DATE(PaymentDate)";
    groupSql = "DATE(PaymentDate)";
  } else if (period === "weekly") {
    labelSql = "CONCAT(YEAR(PaymentDate), '-W', WEEK(PaymentDate))";
    groupSql = "YEAR(PaymentDate), WEEK(PaymentDate)";
  } else if (period === "monthly") {
    labelSql = "DATE_FORMAT(PaymentDate, '%Y-%m')";
    groupSql = "DATE_FORMAT(PaymentDate, '%Y-%m')";
  } else if (period === "yearly") {
    labelSql = "YEAR(PaymentDate)";
    groupSql = "YEAR(PaymentDate)";
  } else {
    return res.status(400).json({ error: "Invalid period" });
  }

  const sql = `
    SELECT
      ${labelSql} AS Label,
      IFNULL(SUM(AmountPaid), 0) AS TotalPayments
    FROM payments
    GROUP BY ${groupSql}
    ORDER BY Label ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Payments period report error:", err);
      return res.status(500).json({ error: "Failed to generate payments report" });
    }

    res.json(result);
  });
});

// EXPENSES BY PERIOD
router.get("/expenses/:period", (req, res) => {
  const { period } = req.params;

  let groupSql = "";
  let labelSql = "";

  if (period === "daily") {
    labelSql = "DATE(ExpenseDate)";
    groupSql = "DATE(ExpenseDate)";
  } else if (period === "weekly") {
    labelSql = "CONCAT(YEAR(ExpenseDate), '-W', WEEK(ExpenseDate))";
    groupSql = "YEAR(ExpenseDate), WEEK(ExpenseDate)";
  } else if (period === "monthly") {
    labelSql = "DATE_FORMAT(ExpenseDate, '%Y-%m')";
    groupSql = "DATE_FORMAT(ExpenseDate, '%Y-%m')";
  } else if (period === "yearly") {
    labelSql = "YEAR(ExpenseDate)";
    groupSql = "YEAR(ExpenseDate)";
  } else {
    return res.status(400).json({ error: "Invalid period" });
  }

  const sql = `
    SELECT
      ${labelSql} AS Label,
      IFNULL(SUM(Amount), 0) AS TotalExpenses
    FROM expenses
    GROUP BY ${groupSql}
    ORDER BY Label ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Expenses period report error:", err);
      return res.status(500).json({ error: "Failed to generate expenses report" });
    }

    res.json(result);
  });
});

// LOSSES BY PERIOD
router.get("/losses/:period", (req, res) => {
  const { period } = req.params;

  let groupSql = "";
  let labelSql = "";

  if (period === "daily") {
    labelSql = "DATE(DateRecorded)";
    groupSql = "DATE(DateRecorded)";
  } else if (period === "weekly") {
    labelSql = "CONCAT(YEAR(DateRecorded), '-W', WEEK(DateRecorded))";
    groupSql = "YEAR(DateRecorded), WEEK(DateRecorded)";
  } else if (period === "monthly") {
    labelSql = "DATE_FORMAT(DateRecorded, '%Y-%m')";
    groupSql = "DATE_FORMAT(DateRecorded, '%Y-%m')";
  } else if (period === "yearly") {
    labelSql = "YEAR(DateRecorded)";
    groupSql = "YEAR(DateRecorded)";
  } else {
    return res.status(400).json({ error: "Invalid period" });
  }

  const sql = `
    SELECT
      ${labelSql} AS Label,
      IFNULL(SUM(Quantity), 0) AS TotalLosses
    FROM losses
    GROUP BY ${groupSql}
    ORDER BY Label ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Losses period report error:", err);
      return res.status(500).json({ error: "Failed to generate losses report" });
    }

    res.json(result);
  });
});

// TOP PRODUCTS
router.get("/top-products", (req, res) => {
  const sql = `
    SELECT
      p.ProductName,
      IFNULL(SUM(sd.Quantity), 0) AS TotalSold,
      IFNULL(SUM(sd.Subtotal), 0) AS TotalRevenue
    FROM sales_details sd
    JOIN products p ON sd.ProductID = p.ProductID
    GROUP BY p.ProductID, p.ProductName
    ORDER BY TotalSold DESC
    LIMIT 10
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Top products report error:", err);
      return res.status(500).json({ error: "Failed to fetch top-selling products" });
    }

    res.json(result);
  });
});

// LOW STOCK
router.get("/low-stock", (req, res) => {
  const sql = `
    SELECT ProductID, ProductName, StockQty
    FROM products
    WHERE StockQty <= 5
    ORDER BY StockQty ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Low stock report error:", err);
      return res.status(500).json({ error: "Failed to fetch low stock products" });
    }

    res.json(result);
  });
});

module.exports = router;