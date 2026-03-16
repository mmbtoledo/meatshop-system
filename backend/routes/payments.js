const express = require("express");
const router = express.Router();
const db = require("../db");

// GET PAYMENTS
router.get("/", (req, res) => {
  const sql = `
    SELECT *
    FROM payments
    ORDER BY PaymentID DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET payments error:", err);
      return res.status(500).json({ error: "Failed to fetch payments" });
    }

    res.json(result);
  });
});

// ADD PAYMENT
router.post("/", (req, res) => {
  const { SalesID, AmountPaid, PaymentMethod, ReferenceNumber, CashReceived } = req.body;

  if (!SalesID || !AmountPaid || !PaymentMethod) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  if (PaymentMethod === "GCash" && !ReferenceNumber) {
    return res.status(400).json({ error: "Reference number is required for GCash" });
  }

  let changeAmount = 0;
  const cashValue = CashReceived ? Number(CashReceived) : 0;
  const paidValue = Number(AmountPaid);

  if (PaymentMethod === "Cash") {
    if (cashValue < paidValue) {
      return res.status(400).json({ error: "Cash received is less than amount paid" });
    }
    changeAmount = cashValue - paidValue;
  }

  const sql = `
    INSERT INTO payments
    (SalesID, PaymentDate, AmountPaid, PaymentMethod, ReferenceNumber, CashReceived, ChangeAmount)
    VALUES (?, NOW(), ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [SalesID, paidValue, PaymentMethod, ReferenceNumber || null, cashValue || null, changeAmount],
    (err) => {
      if (err) {
        console.log("POST payment error:", err);
        return res.status(500).json({ error: "Failed to record payment" });
      }

      res.json({ message: "Payment recorded successfully" });
    }
  );
});

module.exports = router;