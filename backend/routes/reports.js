const express = require("express");
const router = express.Router();
const db = require("../db");

// Helper map for grouping by period
const groupMap = {
  daily: {
    sales: "DATE(s.SalesDate)",
    payments: "DATE(p.PaymentDate)",
    expenses: "DATE(e.ExpenseDate)",
    losses: "DATE(l.DateRecorded)"
  },
  weekly: {
    sales: "YEARWEEK(s.SalesDate, 1)",
    payments: "YEARWEEK(p.PaymentDate, 1)",
    expenses: "YEARWEEK(e.ExpenseDate, 1)",
    losses: "YEARWEEK(l.DateRecorded, 1)"
  },
  monthly: {
    sales: "DATE_FORMAT(s.SalesDate, '%Y-%m')",
    payments: "DATE_FORMAT(p.PaymentDate, '%Y-%m')",
    expenses: "DATE_FORMAT(e.ExpenseDate, '%Y-%m')",
    losses: "DATE_FORMAT(l.DateRecorded, '%Y-%m')"
  },
  yearly: {
    sales: "YEAR(s.SalesDate)",
    payments: "YEAR(p.PaymentDate)",
    expenses: "YEAR(e.ExpenseDate)",
    losses: "YEAR(l.DateRecorded)"
  }
};

// =========================
// DASHBOARD SUMMARY
// =========================
router.get("/summary", (req, res) => {
  const summary = {
    totalSales: 0,
    totalPayments: 0,
    totalExpenses: 0,
    totalLosses: 0,
    lowStockCount: 0,
    netProfit: 0
  };

  const salesSql = `
    SELECT COALESCE(SUM(Subtotal), 0) AS totalSales
    FROM sales_details
  `;

  const paymentsSql = `
    SELECT COALESCE(SUM(AmountPaid), 0) AS totalPayments
    FROM payments
  `;

  const expensesSql = `
    SELECT COALESCE(SUM(Amount), 0) AS totalExpenses
    FROM expenses
  `;

  const lossesSql = `
    SELECT COALESCE(SUM(Quantity), 0) AS totalLosses
    FROM losses
  `;

  const lowStockSql = `
    SELECT COUNT(*) AS lowStockCount
    FROM products
    WHERE StockQty <= 10
  `;

  db.query(salesSql, (err1, salesResult) => {
    if (err1) {
      console.error("Dashboard sales summary error:", err1);
      return res.status(500).json({ message: "Failed to load dashboard summary." });
    }

    summary.totalSales = Number(salesResult[0]?.totalSales || 0);

    db.query(paymentsSql, (err2, paymentsResult) => {
      if (err2) {
        console.error("Dashboard payments summary error:", err2);
        return res.status(500).json({ message: "Failed to load dashboard summary." });
      }

      summary.totalPayments = Number(paymentsResult[0]?.totalPayments || 0);

      db.query(expensesSql, (err3, expensesResult) => {
        if (err3) {
          console.error("Dashboard expenses summary error:", err3);
          return res.status(500).json({ message: "Failed to load dashboard summary." });
        }

        summary.totalExpenses = Number(expensesResult[0]?.totalExpenses || 0);

        db.query(lossesSql, (err4, lossesResult) => {
          if (err4) {
            console.error("Dashboard losses summary error:", err4);
            return res.status(500).json({ message: "Failed to load dashboard summary." });
          }

          summary.totalLosses = Number(lossesResult[0]?.totalLosses || 0);
          summary.netProfit = summary.totalPayments - summary.totalExpenses;

          db.query(lowStockSql, (err5, lowStockResult) => {
            if (err5) {
              console.error("Dashboard low stock summary error:", err5);
              return res.status(500).json({ message: "Failed to load dashboard summary." });
            }

            summary.lowStockCount = Number(lowStockResult[0]?.lowStockCount || 0);

            res.json({
              TotalSales: summary.totalSales,
              TotalPayments: summary.totalPayments,
              TotalExpenses: summary.totalExpenses,
              TotalLosses: summary.totalLosses,
              LowStockProducts: summary.lowStockCount,
              NetProfit: summary.netProfit
            });
          });
        });
      });
    });
  });
});

// =========================
// LOW STOCK PRODUCTS
// =========================
router.get("/low-stock", (req, res) => {
  const sql = `
    SELECT ProductID, ProductName, StockQty, CurrentPrice
    FROM products
    WHERE StockQty <= 10
    ORDER BY StockQty ASC, ProductName ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Low stock report error:", err);
      return res.status(500).json({ message: "Low stock report failed." });
    }

    res.json(results);
  });
});

// =========================
// SALES REPORT
// =========================
router.get("/sales/:period", (req, res) => {
  const { period } = req.params;
  const groupBy = groupMap[period]?.sales;

  if (!groupBy) {
    return res.status(400).json({ message: "Invalid period." });
  }

  const sql = `
    SELECT
      ${groupBy} AS Label,
      COALESCE(SUM(sd.Subtotal), 0) AS TotalSales
    FROM sales s
    LEFT JOIN sales_details sd ON s.SalesID = sd.SalesID
    GROUP BY Label
    ORDER BY Label
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Sales report error:", err);
      return res.status(500).json({ message: "Sales report failed." });
    }

    res.json(results);
  });
});

// =========================
// PAYMENTS REPORT
// =========================
router.get("/payments/:period", (req, res) => {
  const { period } = req.params;
  const groupBy = groupMap[period]?.payments;

  if (!groupBy) {
    return res.status(400).json({ message: "Invalid period." });
  }

  const sql = `
    SELECT
      ${groupBy} AS Label,
      COALESCE(SUM(p.AmountPaid), 0) AS TotalPayments
    FROM payments p
    GROUP BY Label
    ORDER BY Label
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Payments report error:", err);
      return res.status(500).json({ message: "Payments report failed." });
    }

    res.json(results);
  });
});

// =========================
// EXPENSES REPORT
// =========================
router.get("/expenses/:period", (req, res) => {
  const { period } = req.params;
  const groupBy = groupMap[period]?.expenses;

  if (!groupBy) {
    return res.status(400).json({ message: "Invalid period." });
  }

  const sql = `
    SELECT
      ${groupBy} AS Label,
      COALESCE(SUM(e.Amount), 0) AS TotalExpenses
    FROM expenses e
    GROUP BY Label
    ORDER BY Label
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Expenses report error:", err);
      return res.status(500).json({ message: "Expenses report failed." });
    }

    res.json(results);
  });
});

// =========================
// LOSSES REPORT
// =========================
router.get("/losses/:period", (req, res) => {
  const { period } = req.params;
  const groupBy = groupMap[period]?.losses;

  if (!groupBy) {
    return res.status(400).json({ message: "Invalid period." });
  }

  const sql = `
    SELECT
      ${groupBy} AS Label,
      COALESCE(SUM(l.Quantity), 0) AS TotalLosses
    FROM losses l
    GROUP BY Label
    ORDER BY Label
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Losses report error:", err);
      return res.status(500).json({ message: "Losses report failed." });
    }

    res.json(results);
  });
});

// =========================
// TOP PRODUCTS REPORT
// =========================
router.get("/top-products", (req, res) => {
  const sql = `
    SELECT
      p.ProductName,
      COALESCE(SUM(sd.Quantity), 0) AS TotalSold
    FROM sales_details sd
    JOIN products p ON sd.ProductID = p.ProductID
    GROUP BY p.ProductID, p.ProductName
    ORDER BY TotalSold DESC, p.ProductName ASC
    LIMIT 10
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Top products report error:", err);
      return res.status(500).json({ message: "Top products report failed." });
    }

    res.json(results);
  });
});

// =========================
// MONTHLY SALES TREND
// =========================
router.get("/monthly-sales-trend", (req, res) => {
  const sql = `
    SELECT
      DATE_FORMAT(s.SalesDate, '%Y-%m') AS Label,
      COALESCE(SUM(sd.Subtotal), 0) AS TotalSales
    FROM sales s
    LEFT JOIN sales_details sd ON s.SalesID = sd.SalesID
    GROUP BY Label
    ORDER BY Label
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Monthly sales trend error:", err);
      return res.status(500).json({ message: "Monthly sales trend failed." });
    }

    res.json(results);
  });
});

module.exports = router;