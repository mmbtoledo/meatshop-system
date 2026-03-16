import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

function Dashboard() {
  const [summary, setSummary] = useState({
    TotalSales: 0,
    TotalPayments: 0,
    TotalExpenses: 0,
    TotalLosses: 0,
    LowStockProducts: 0,
    NetProfit: 0
  });

  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSummary();
    fetchSalesTrend();
    fetchTopProducts();
    fetchLowStock();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/summary");
      setSummary({
        TotalSales: Number(res.data?.TotalSales || 0),
        TotalPayments: Number(res.data?.TotalPayments || 0),
        TotalExpenses: Number(res.data?.TotalExpenses || 0),
        TotalLosses: Number(res.data?.TotalLosses || 0),
        LowStockProducts: Number(res.data?.LowStockProducts || 0),
        NetProfit: Number(res.data?.NetProfit || 0)
      });
    } catch (err) {
      console.error("Summary fetch error:", err);
      setMessage("Failed to load dashboard summary.");
    }
  };

  const fetchSalesTrend = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/sales/monthly");
      setSalesTrend(res.data || []);
    } catch (err) {
      console.error("Sales trend fetch error:", err);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/top-products");
      setTopProducts(res.data || []);
    } catch (err) {
      console.error("Top products fetch error:", err);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/low-stock");
      setLowStock(res.data || []);
    } catch (err) {
      console.error("Low stock fetch error:", err);
    }
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "24px", fontSize: "40px", color: "#4a251b" }}>
        Dashboard
      </h1>

      {message && (
        <p style={{ color: "red", marginBottom: "15px", fontWeight: "600" }}>
          {message}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "18px",
          marginBottom: "24px"
        }}
      >
        <div style={cardStyle}>
          <h3>Total Sales</h3>
          <p style={{ fontSize: "28px", fontWeight: "800", color: "#5c2d1f" }}>
            ₱{Number(summary.TotalSales || 0).toLocaleString()}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Payments</h3>
          <p style={{ fontSize: "28px", fontWeight: "800", color: "#5c2d1f" }}>
            ₱{Number(summary.TotalPayments || 0).toLocaleString()}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Total Expenses</h3>
          <p style={{ fontSize: "28px", fontWeight: "800", color: "#8c3f2f" }}>
            ₱{Number(summary.TotalExpenses || 0).toLocaleString()}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Net Profit</h3>
          <p style={{ fontSize: "28px", fontWeight: "800", color: "green" }}>
            ₱{Number(summary.NetProfit || 0).toLocaleString()}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Low Stock</h3>
          <p style={{ fontSize: "28px", fontWeight: "800", color: "red" }}>
            {Number(summary.LowStockProducts || 0)}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginBottom: "24px"
        }}
      >
        <div style={cardStyle}>
          <h3 style={{ marginBottom: "15px" }}>Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="TotalSales" stroke="#8c3f2f" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: "15px" }}>Low Stock Alerts</h3>
          {lowStock.length > 0 ? (
            lowStock.map((item) => (
              <div
                key={item.ProductID}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #eee"
                }}
              >
                <strong>{item.ProductName}</strong>
                <p style={{ margin: 0, color: "red" }}>Stock: {item.StockQty}</p>
              </div>
            ))
          ) : (
            <p>No low stock products.</p>
          )}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginBottom: "15px" }}>Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ProductName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="TotalSold" fill="#5c2d1f" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;