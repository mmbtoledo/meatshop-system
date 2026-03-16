import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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
    setMessage("");

    try {
      const salesRes = await axios.get(`http://localhost:5000/api/reports/sales/${selectedPeriod}`);
      setSalesData(salesRes.data || []);
    } catch (err) {
      console.error("Sales report error:", err);
      setSalesData([]);
      setMessage((prev) => prev + " Sales report failed.");
    }

    try {
      const paymentsRes = await axios.get(`http://localhost:5000/api/reports/payments/${selectedPeriod}`);
      setPaymentsData(paymentsRes.data || []);
    } catch (err) {
      console.error("Payments report error:", err);
      setPaymentsData([]);
      setMessage((prev) => prev + " Payments report failed.");
    }

    try {
      const expensesRes = await axios.get(`http://localhost:5000/api/reports/expenses/${selectedPeriod}`);
      setExpensesData(expensesRes.data || []);
    } catch (err) {
      console.error("Expenses report error:", err);
      setExpensesData([]);
      setMessage((prev) => prev + " Expenses report failed.");
    }

    try {
      const lossesRes = await axios.get(`http://localhost:5000/api/reports/losses/${selectedPeriod}`);
      setLossesData(lossesRes.data || []);
    } catch (err) {
      console.error("Losses report error:", err);
      setLossesData([]);
      setMessage((prev) => prev + " Losses report failed.");
    }

    try {
      const topProductsRes = await axios.get(`http://localhost:5000/api/reports/top-products`);
      setTopProducts(topProductsRes.data || []);
    } catch (err) {
      console.error("Top products report error:", err);
      setTopProducts([]);
      setMessage((prev) => prev + " Top products report failed.");
    }
  };

  const boxStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    marginBottom: "20px"
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "40px", color: "#4a251b", marginBottom: "20px" }}>Reports</h1>

      <div style={boxStyle}>
        <label style={{ fontWeight: "600", marginRight: "10px" }}>View Records By:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {message && (
          <p style={{ color: "red", marginTop: "12px", fontWeight: "600" }}>
            {message}
          </p>
        )}
      </div>

      <div style={boxStyle}>
        <h2>Sales Records ({period})</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="TotalSales" stroke="#8c3f2f" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={boxStyle}>
        <h2>Payments Records ({period})</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="TotalPayments" fill="#5c2d1f" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={boxStyle}>
        <h2>Expenses Records ({period})</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expensesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="TotalExpenses" fill="#c0392b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={boxStyle}>
        <h2>Losses Records ({period})</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lossesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="TotalLosses" fill="#7f8c8d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={boxStyle}>
        <h2>Most Sold Products</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ProductName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="TotalSold" fill="#8c3f2f" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Reports;