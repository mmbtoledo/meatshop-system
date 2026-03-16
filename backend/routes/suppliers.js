const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL SUPPLIERS
router.get("/", (req, res) => {
  const sql = "SELECT * FROM suppliers ORDER BY SupplierID DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET suppliers error:", err);
      return res.status(500).json({ error: "Failed to fetch suppliers" });
    }

    res.json(result);
  });
});

// ADD SUPPLIER
router.post("/", (req, res) => {
  const { SupplierName, ContactNumber } = req.body;

  if (!SupplierName || !ContactNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    INSERT INTO suppliers (SupplierName, ContactNumber)
    VALUES (?, ?)
  `;

  db.query(sql, [SupplierName, ContactNumber], (err, result) => {
    if (err) {
      console.log("POST supplier error:", err);
      return res.status(500).json({ error: "Failed to add supplier" });
    }

    res.json({ message: "Supplier added successfully" });
  });
});

// UPDATE SUPPLIER
router.put("/:id", (req, res) => {
  const { SupplierName, ContactNumber } = req.body;
  const supplierId = req.params.id;

  if (!SupplierName || !ContactNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    UPDATE suppliers
    SET SupplierName = ?, ContactNumber = ?
    WHERE SupplierID = ?
  `;

  db.query(sql, [SupplierName, ContactNumber, supplierId], (err, result) => {
    if (err) {
      console.log("PUT supplier error:", err);
      return res.status(500).json({ error: "Failed to update supplier" });
    }

    res.json({ message: "Supplier updated successfully" });
  });
});

// DELETE SUPPLIER
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM suppliers WHERE SupplierID = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log("DELETE supplier error:", err);
      return res.status(500).json({ error: "Failed to delete supplier" });
    }

    res.json({ message: "Supplier deleted successfully" });
  });
});

module.exports = router;