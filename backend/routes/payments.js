const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all payments
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      PaymentID,
      SalesID,
      PaymentDate,
      AmountPaid,
      PaymentMethod,
      ReferenceNumber,
      CashReceived,
      ChangeAmount
    FROM payments
    ORDER BY PaymentID DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch payments error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.json(results);
  });
});

// GET unpaid sales only
router.get("/unpaid-sales", (req, res) => {
  const sql = `
    SELECT 
      s.SalesID,
      s.SalesDate,
      COALESCE(SUM(sd.Subtotal), 0) AS TotalAmount
    FROM sales s
    LEFT JOIN sales_details sd ON s.SalesID = sd.SalesID
    LEFT JOIN payments p ON s.SalesID = p.SalesID
    WHERE p.SalesID IS NULL
    GROUP BY s.SalesID, s.SalesDate
    ORDER BY s.SalesID DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch unpaid sales error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.json(results);
  });
});

// ADD payment
router.post("/", (req, res) => {
  const {
    SalesID,
    PaymentDate,
    AmountPaid,
    PaymentMethod,
    ReferenceNumber,
    CashReceived,
    ChangeAmount
  } = req.body;

  if (!SalesID) {
    return res.status(400).json({ message: "Sales ID is required." });
  }

  if (!PaymentDate) {
    return res.status(400).json({ message: "Payment date is required." });
  }

  // 🔥 STRONG DATE VALIDATION
  const today = new Date();
  const selectedDate = new Date(PaymentDate);

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return res.status(400).json({
      message: "Payment date cannot be in the past."
    });
  }

  if (
    AmountPaid === "" ||
    AmountPaid === null ||
    isNaN(AmountPaid) ||
    Number(AmountPaid) <= 0
  ) {
    return res.status(400).json({
      message: "Amount must be greater than 0."
    });
  }

  if (!PaymentMethod) {
    return res.status(400).json({ message: "Payment method is required." });
  }

  if (PaymentMethod === "Cash") {
    if (
      CashReceived === "" ||
      isNaN(CashReceived) ||
      Number(CashReceived) <= 0
    ) {
      return res.status(400).json({
        message: "Cash received must be greater than 0."
      });
    }

    if (Number(CashReceived) < Number(AmountPaid)) {
      return res.status(400).json({
        message: "Cash received cannot be less than amount paid."
      });
    }
  }

  if (PaymentMethod === "GCash" && !ReferenceNumber) {
    return res.status(400).json({
      message: "Reference number is required for GCash."
    });
  }

  const sql = `
    INSERT INTO payments
    (SalesID, PaymentDate, AmountPaid, PaymentMethod, ReferenceNumber, CashReceived, ChangeAmount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      SalesID,
      PaymentDate,
      AmountPaid,
      PaymentMethod,
      ReferenceNumber || null,
      CashReceived || null,
      ChangeAmount || 0
    ],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "This sale already has a payment."
          });
        }

        return res.status(500).json({ message: "Database error." });
      }

      res.status(201).json({ message: "Payment saved successfully." });
    }
  );
});

// DELETE payment
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM payments WHERE PaymentID = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error." });
    }

    res.json({ message: "Payment deleted successfully." });
  });
});

module.exports = router;