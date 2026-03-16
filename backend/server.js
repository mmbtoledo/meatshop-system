const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const supplierRoutes = require("./routes/suppliers");
const deliveryRoutes = require("./routes/deliveries");
const salesRoutes = require("./routes/sales");
const paymentRoutes = require("./routes/payments");
const expenseRoutes = require("./routes/expenses");
const lossRoutes = require("./routes/losses");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");

app.get("/", (req, res) => {
  res.send("Lovier's Meatshop API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/losses", lossRoutes);
app.use("/api/reports", reportRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});