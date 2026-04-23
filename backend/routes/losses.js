router.post("/", (req, res) => {
  const { ProductID, Quantity, LossType, DateRecorded } = req.body;

  // REQUIRED
  if (!ProductID || Quantity === undefined || Quantity === "" || !LossType || !DateRecorded) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const qty = parseFloat(Quantity);

  // VALID NUMBER
  if (isNaN(qty)) {
    return res.status(400).json({
      error: "Quantity must be a valid number"
    });
  }

  // BLOCK ZERO / NEGATIVE
  if (qty <= 0) {
    return res.status(400).json({
      error: "Quantity must be greater than 0"
    });
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

    if (qty > Number(currentStock)) {
      return res.status(400).json({
        error: "Insufficient stock for loss recording"
      });
    }

    const lossSql = `
      INSERT INTO losses (ProductID, Quantity, LossType, DateRecorded)
      VALUES (?, ?, ?, ?)
    `;

    db.query(lossSql, [ProductID, qty, LossType, DateRecorded], (err) => {
      if (err) {
        console.log("POST loss error:", err);
        return res.status(500).json({ error: "Failed to record loss" });
      }

      const updateStockSql = `
        UPDATE products
        SET StockQty = StockQty - ?
        WHERE ProductID = ?
      `;

      db.query(updateStockSql, [qty, ProductID], (updateErr) => {
        if (updateErr) {
          console.log("Loss stock update error:", updateErr);
          return res.status(500).json({
            error: "Loss recorded but failed to update stock"
          });
        }

        res.json({ message: "Loss recorded successfully" });
      });
    });
  });
});