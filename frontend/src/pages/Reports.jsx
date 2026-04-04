import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function Reports() {
  const [period, setPeriod] = useState("monthly");
  const [salesData, setSalesData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [lossesData, setLossesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllReports(period);
  }, [period]);

  const fetchAllReports = async (selectedPeriod) => {
    let errors = [];

    try {
      const salesRes = await axios.get(`http://localhost:5000/api/reports/sales/${selectedPeriod}`);
      setSalesData(salesRes.data || []);
    } catch (err) {
      console.error("Sales report error:", err);
      setSalesData([]);
      errors.push("Sales report failed.");
    }

    try {
      const paymentsRes = await axios.get(`http://localhost:5000/api/reports/payments/${selectedPeriod}`);
      setPaymentsData(paymentsRes.data || []);
    } catch (err) {
      console.error("Payments report error:", err);
      setPaymentsData([]);
      errors.push("Payments report failed.");
    }

    try {
      const expensesRes = await axios.get(`http://localhost:5000/api/reports/expenses/${selectedPeriod}`);
      setExpensesData(expensesRes.data || []);
    } catch (err) {
      console.error("Expenses report error:", err);
      setExpensesData([]);
      errors.push("Expenses report failed.");
    }

    try {
      const lossesRes = await axios.get(`http://localhost:5000/api/reports/losses/${selectedPeriod}`);
      setLossesData(lossesRes.data || []);
    } catch (err) {
      console.error("Losses report error:", err);
      setLossesData([]);
      errors.push("Losses report failed.");
    }

    try {
      const topProductsRes = await axios.get("http://localhost:5000/api/reports/top-products");
      setTopProducts(topProductsRes.data || []);
    } catch (err) {
      console.error("Top products report error:", err);
      setTopProducts([]);
      errors.push("Top products report failed.");
    }

    setMessage(errors.join(" "));
  };

  const pageStyle = {
    padding: "30px",
    background: "linear-gradient(135deg, #f8f4f1 0%, #f1ebe6 100%)",
    minHeight: "100vh"
  };

  const titleStyle = {
    fontSize: "48px",
    color: "#4a251b",
    marginBottom: "20px",
    fontWeight: "800"
  };

  const boxStyle = {
    background: "linear-gradient(145deg, #fffdfb, #f7efe8)",
    padding: "22px",
    borderRadius: "22px",
    boxShadow: "0 10px 30px rgba(74, 37, 27, 0.10)",
    marginBottom: "22px",
    border: "1px solid rgba(196, 154, 108, 0.18)"
  };

  const renderLineGraph = (title, data, dataKey, strokeColor) => (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={boxStyle}
    >
      <h2 style={{ color: "#4a251b", marginBottom: "14px" }}>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );

  return (
    <div style={pageStyle}>
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={titleStyle}
      >
        Reports
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={boxStyle}
      >
        <label style={{ fontWeight: "700", marginRight: "10px", color: "#4a251b" }}>
          View Records By:
        </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #ccb39a",
            background: "#fffaf5",
            fontWeight: "600",
            color: "#4a251b"
          }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {message && (
          <p style={{ color: "#d32f2f", marginTop: "12px", fontWeight: "700" }}>
            {message}
          </p>
        )}
      </motion.div>

      {renderLineGraph(`Sales Records (${period})`, salesData, "TotalSales", "#8c3f2f")}
      {renderLineGraph(`Payments Records (${period})`, paymentsData, "TotalPayments", "#5c2d1f")}
      {renderLineGraph(`Expenses Records (${period})`, expensesData, "TotalExpenses", "#b23a2a")}
      {renderLineGraph(`Losses Records (${period})`, lossesData, "TotalLosses", "#6d4c41")}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={boxStyle}
      >
        <h2 style={{ color: "#4a251b", marginBottom: "14px" }}>Most Sold Products</h2>
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
              stroke="#7a3525"
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

export default Reports;