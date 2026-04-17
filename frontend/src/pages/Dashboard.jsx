import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
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

  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState("");
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [message, setMessage] = useState("");

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
      setMessage("");
    } catch (err) {
      console.error("Summary fetch error:", err);
      setMessage("Failed to load dashboard summary.");
    }
  };

  const fetchSalesTrend = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/monthly-sales-trend");
      setSalesTrend(res.data || []);
    } catch (err) {
      console.error("Sales trend fetch error:", err);
      setSalesTrend([]);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/top-products");
      setTopProducts(res.data || []);
    } catch (err) {
      console.error("Top products fetch error:", err);
      setTopProducts([]);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/low-stock");
      setLowStock(res.data || []);
    } catch (err) {
      console.error("Low stock fetch error:", err);
      setLowStock([]);
    }
  };

  const fetchDashboardData = () => {
    fetchSummary();
    fetchSalesTrend();
    fetchTopProducts();
    fetchLowStock();
  };

  useEffect(() => {
  fetchDashboardData();

  // ✅ SHOW WELCOME POPUP
  const storedName = localStorage.getItem("username");
  if (storedName) {
    setUsername(storedName);
    setShowWelcome(true);

    setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
  }

  const interval = setInterval(() => {
    fetchDashboardData();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  const pageStyle = {
    padding: "30px",
    background: "linear-gradient(135deg, #f8f4f1 0%, #f1ebe6 100%)",
    minHeight: "100vh"
  };

  const titleStyle = {
    marginBottom: "24px",
    fontSize: "48px",
    fontWeight: "800",
    color: "#4a251b",
    letterSpacing: "0.5px"
  };

  const cardStyle = {
    background: "linear-gradient(145deg, #fffdfb, #f7efe8)",
    padding: "24px",
    borderRadius: "22px",
    boxShadow: "0 10px 30px rgba(74, 37, 27, 0.10)",
    border: "1px solid rgba(196, 154, 108, 0.18)"
  };

  const profitColor = summary.NetProfit < 0 ? "#c62828" : "#1f7a3d";

  const statCards = [
    {
      title: "Total Sales",
      value: `₱${Number(summary.TotalSales || 0).toLocaleString()}`,
      color: "#5c2d1f"
    },
    {
      title: "Total Payments",
      value: `₱${Number(summary.TotalPayments || 0).toLocaleString()}`,
      color: "#7a3525"
    },
    {
      title: "Total Expenses",
      value: `₱${Number(summary.TotalExpenses || 0).toLocaleString()}`,
      color: "#9b4b35"
    },
    {
      title: "Net Profit",
      value: `₱${Number(summary.NetProfit || 0).toLocaleString()}`,
      color: profitColor
    },
    {
      title: "Low Stock",
      value: Number(summary.LowStockProducts || 0),
      color: "#c62828"
    }
  ];

  return (
    <div style={pageStyle}>
    {showWelcome && (
  <div
    style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "#4a251b",
      color: "white",
      padding: "12px 18px",
      borderRadius: "12px",
      fontWeight: "700",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      zIndex: 999
    }}
  >
    Welcome, {username} 👋
  </div>
)}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={titleStyle}
      >
        Dashboard
      </motion.h1>

      {message && (
        <p style={{ color: "#d32f2f", marginBottom: "15px", fontWeight: "700" }}>
          {message}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px",
          marginBottom: "24px"
        }}
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            style={cardStyle}
          >
            <h3 style={{ color: "#4a251b", marginBottom: "12px", fontSize: "24px" }}>
              {card.title}
            </h3>
            <p
              style={{
                fontSize: "34px",
                fontWeight: "800",
                color: card.color,
                margin: 0
              }}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginBottom: "24px"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={cardStyle}
        >
          <h3 style={{ marginBottom: "18px", color: "#4a251b", fontSize: "28px" }}>
            Monthly Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7d7ca" />
              <XAxis dataKey="Label" stroke="#6d4c41" />
              <YAxis stroke="#6d4c41" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fffaf5",
                  borderRadius: "12px",
                  border: "1px solid #d7b899"
                }}
              />
              <Line
                type="monotone"
                dataKey="TotalSales"
                stroke="#8c3f2f"
                strokeWidth={4}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          style={cardStyle}
        >
          <h3 style={{ marginBottom: "18px", color: "#4a251b", fontSize: "28px" }}>
            Low Stock Alerts
          </h3>

          {lowStock.length > 0 ? (
            lowStock.map((item, index) => (
              <motion.div
                key={item.ProductID}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #eaded3"
                }}
              >
                <strong style={{ color: "#4a251b", fontSize: "16px" }}>
                  {item.ProductName}
                </strong>
                <p style={{ margin: "4px 0 0", color: "#c62828", fontWeight: "600" }}>
                  Stock: {item.StockQty}
                </p>
              </motion.div>
            ))
          ) : (
            <p style={{ color: "#4a251b" }}>No low stock products.</p>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
        style={cardStyle}
      >
        <h3 style={{ marginBottom: "18px", color: "#4a251b", fontSize: "28px" }}>
          Top Selling Products
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7d7ca" />
            <XAxis dataKey="ProductName" stroke="#6d4c41" />
            <YAxis stroke="#6d4c41" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fffaf5",
                borderRadius: "12px",
                border: "1px solid #d7b899"
              }}
            />
            <Line
              type="monotone"
              dataKey="TotalSold"
              stroke="#5c2d1f"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export default Dashboard;