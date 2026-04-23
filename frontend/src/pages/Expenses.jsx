import { useEffect, useState } from "react";
import axios from "axios";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [ExpenseDate, setExpenseDate] = useState("");
  const [Description, setDescription] = useState("");
  const [Amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(Amount);

    // FRONTEND VALIDATION
    if (!Amount) {
      setMessage("Amount is required");
      return;
    }

    if (isNaN(amount)) {
      setMessage("Amount must be a valid number");
      return;
    }

    if (amount <= 0) {
      setMessage("Amount must be greater than 0");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/expenses", {
        ExpenseDate,
        Description,
        Amount: amount
      });

      setMessage(res.data.message);
      setExpenseDate("");
      setDescription("");
      setAmount("");
      fetchExpenses();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add expense");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Expenses</h1>

      <div style={boxStyle}>
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Date</label>
            <input
              type="date"
              value={ExpenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Description</label>
            <input
              type="text"
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Amount</label>
            <input
              type="text"
              value={Amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");

                // prevent multiple decimals
                if ((value.match(/\./g) || []).length > 1) return;

                setAmount(value);
              }}
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Save Expense
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </div>

      <div style={boxStyle}>
        <h2>Expense List</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.ExpenseID}>
                <td style={tdStyle}>{expense.ExpenseID}</td>
                <td style={tdStyle}>{expense.ExpenseDate}</td>
                <td style={tdStyle}>{expense.Description}</td>
                <td style={tdStyle}>₱{expense.Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// STYLES (UNCHANGED)
const boxStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginBottom: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  backgroundColor: "green",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f2f2f2"
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px"
};

export default Expenses;