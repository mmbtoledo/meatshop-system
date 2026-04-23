const express = require("express");
const router = express.Router();
const db = require("../db");

// =======================
// GET ALL SUPPLIERS (WITH DISPLAY ID)
// =======================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY s.SupplierID DESC) AS SupplierID,
      s.SupplierID AS RealSupplierID,
      s.SupplierName,
      s.ContactNumber
    FROM suppliers s
    ORDER BY s.SupplierID DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET suppliers error:", err);
      return res.status(500).json({ error: "Failed to fetch suppliers" });
    }

    res.json(result);
  });
});

// =======================
// ADD SUPPLIER
// =======================
router.post("/", (req, res) => {
  const { SupplierName, ContactNumber } = req.body;

  if (!SupplierName || !ContactNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // 🔥 CONTACT VALIDATION
  if (!/^\d{11}$/.test(ContactNumber)) {
    return res.status(400).json({
      error: "Contact number must be exactly 11 digits."
    });
  }

  // 🔥 DUPLICATE CHECK
  const checkSql = "SELECT * FROM suppliers WHERE LOWER(SupplierName) = LOWER(?)";

  db.query(checkSql, [SupplierName], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ error: "Database error." });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({
        error: "Supplier name already exists."
      });
    }

    const sql = `
      INSERT INTO suppliers (SupplierName, ContactNumber)
      VALUES (?, ?)
    `;

    db.query(sql, [SupplierName, ContactNumber], (err) => {
      if (err) {
        console.log("POST supplier error:", err);
        return res.status(500).json({ error: "Failed to add supplier" });
      }

      res.json({ message: "Supplier added successfully" });
    });
  });
});

// =======================
// UPDATE SUPPLIER
// =======================
router.put("/:id", (req, res) => {
  const { SupplierName, ContactNumber } = req.body;
  const supplierId = req.params.id;

  if (!SupplierName || !ContactNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // 🔥 CONTACT VALIDATION
  if (!/^\d{11}$/.test(ContactNumber)) {
    return res.status(400).json({
      error: "Contact number must be exactly 11 digits."
    });
  }

  // 🔥 DUPLICATE CHECK (exclude current)
  const checkSql = `
    SELECT * FROM suppliers 
    WHERE LOWER(SupplierName) = LOWER(?) AND SupplierID != ?
  `;

  db.query(checkSql, [SupplierName, supplierId], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ error: "Database error." });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({
        error: "Supplier name already exists."
      });
    }

    const sql = `
      UPDATE suppliers
      SET SupplierName = ?, ContactNumber = ?
      WHERE SupplierID = ?
    `;

    db.query(sql, [SupplierName, ContactNumber, supplierId], (err) => {
      if (err) {
        console.log("PUT supplier error:", err);
        return res.status(500).json({ error: "Failed to update supplier" });
      }

      res.json({ message: "Supplier updated successfully" });
    });
  });
});

// =======================
// DELETE SUPPLIER (SAFE DELETE)
// =======================
router.delete("/:id", (req, res) => {
  const supplierId = req.params.id;

  // 🔥 CHECK IF USED IN DELIVERIES
  const checkSql = "SELECT * FROM deliveries WHERE SupplierID = ?";

  db.query(checkSql, [supplierId], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ error: "Database error." });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({
        error: "Cannot delete supplier. It is used in deliveries."
      });
    }

    const sql = "DELETE FROM suppliers WHERE SupplierID = ?";

    db.query(sql, [supplierId], (err) => {
      if (err) {
        console.log("DELETE supplier error:", err);
        return res.status(500).json({ error: "Failed to delete supplier" });
      }

      res.json({ message: "Supplier deleted successfully" });
    });
  });
});

module.exports = router;