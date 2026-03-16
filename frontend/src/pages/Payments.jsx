import { useEffect, useState } from "react";
import axios from "axios";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [SalesID, setSalesID] = useState("");
  const [AmountPaid, setAmountPaid] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [ReferenceNumber, setReferenceNumber] = useState("");
  const [CashReceived, setCashReceived] = useState("");
  const [message, setMessage] = useState("");

  const fetchPayments = async () => {
    const res = await axios.get("http://localhost:5000/api/payments");
    setPayments(res.data);
  };

  const fetchSales = async () => {
    const res = await axios.get("http://localhost:5000/api/sales");
    setSales(res.data);
  };

  useEffect(() => {
    fetchPayments();
    fetchSales();
  }, []);

  const handleSalesChange = (e) => {
    const id = e.target.value;
    setSalesID(id);

    const selectedSale = sales.find((sale) => String(sale.SalesID) === String(id));
    if (selectedSale) {
      setAmountPaid(selectedSale.Subtotal);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/payments", {
        SalesID,
        AmountPaid,
        PaymentMethod,
        ReferenceNumber,
        CashReceived
      });

      setMessage(res.data.message);
      setSalesID("");
      setAmountPaid("");
      setPaymentMethod("Cash");
      setReferenceNumber("");
      setCashReceived("");
      fetchPayments();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to record payment");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Payments</h1>

      <div style={boxStyle}>
        <h2>Record Payment</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Sale</label>
            <select value={SalesID} onChange={handleSalesChange} style={inputStyle}>
              <option value="">Select Sale</option>
              {sales.map((sale, index) => (
                <option key={index} value={sale.SalesID}>
                  Sale #{sale.SalesID} - {sale.ProductName} - ₱{sale.Subtotal}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Amount Paid</label>
            <input type="number" value={AmountPaid} onChange={(e) => setAmountPaid(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Payment Method</label>
            <select value={PaymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={inputStyle}>
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
            </select>
          </div>

          {PaymentMethod === "Cash" && (
            <div style={{ marginBottom: "12px" }}>
              <label>Cash Received</label>
              <input type="number" value={CashReceived} onChange={(e) => setCashReceived(e.target.value)} style={inputStyle} />
            </div>
          )}

          {PaymentMethod === "GCash" && (
            <div style={{ marginBottom: "12px" }}>
              <label>Reference Number</label>
              <input type="text" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} style={inputStyle} />
            </div>
          )}

          <button type="submit" style={buttonStyle}>Save Payment</button>
        </form>

        {message && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p>}
      </div>

      <div style={boxStyle}>
        <h2>Payments List</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Sale ID</th>
              <th style={thStyle}>Method</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Reference</th>
              <th style={thStyle}>Cash</th>
              <th style={thStyle}>Change</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.PaymentID}>
                <td style={tdStyle}>{payment.PaymentID}</td>
                <td style={tdStyle}>{payment.SalesID}</td>
                <td style={tdStyle}>{payment.PaymentMethod}</td>
                <td style={tdStyle}>₱{payment.AmountPaid}</td>
                <td style={tdStyle}>{payment.ReferenceNumber || "-"}</td>
                <td style={tdStyle}>{payment.CashReceived || "-"}</td>
                <td style={tdStyle}>{payment.ChangeAmount || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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

export default Payments;