import React, { useEffect, useState } from "react";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);

  const [SalesID, setSalesID] = useState("");
  const [PaymentDate, setPaymentDate] = useState("");
  const [AmountPaid, setAmountPaid] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [ReferenceNumber, setReferenceNumber] = useState("");
  const [CashReceived, setCashReceived] = useState("");
  const [ChangeAmount, setChangeAmount] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      setPayments(res.data);
    } catch (error) {
      console.error("Fetch payments error:", error);
      alert("Failed to fetch payments.");
    }
  };

  const fetchUnpaidSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments/unpaid-sales");
      setSales(res.data);
    } catch (error) {
      console.error("Fetch unpaid sales error:", error);
      alert("Failed to fetch unpaid sales.");
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUnpaidSales();
  }, []);

  const handleSaleChange = (e) => {
    const selectedSalesID = e.target.value;
    setSalesID(selectedSalesID);

    const selectedSale = sales.find(
      (sale) => String(sale.SalesID) === String(selectedSalesID)
    );

    if (selectedSale) {
      setAmountPaid(selectedSale.TotalAmount);
    } else {
      setAmountPaid("");
    }
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);

    if (method === "GCash") {
      setCashReceived("");
      setChangeAmount("");
    } else {
      setReferenceNumber("");
    }
  };

  const handleCashReceivedChange = (e) => {
    const cash = e.target.value;
    setCashReceived(cash);

    const amount = parseFloat(AmountPaid || 0);
    const received = parseFloat(cash || 0);

    if (received >= amount) {
      setChangeAmount((received - amount).toFixed(2));
    } else {
      setChangeAmount("0");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!SalesID) {
      alert("Please select a sale.");
      return;
    }

    if (!PaymentDate) {
      alert("Payment date is required.");
      return;
    }

    if (!AmountPaid) {
      alert("Amount paid is required.");
      return;
    }

    if (!PaymentMethod) {
      alert("Payment method is required.");
      return;
    }

    if (PaymentMethod === "GCash" && !ReferenceNumber.trim()) {
      alert("Reference number is required for GCash.");
      return;
    }

    if (PaymentMethod === "Cash") {
      if (CashReceived === "") {
        alert("Cash received is required for cash payments.");
        return;
      }

      if (parseFloat(CashReceived) < parseFloat(AmountPaid)) {
        alert("Cash received must not be less than amount paid.");
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/payments", {
        SalesID,
        PaymentDate,
        AmountPaid,
        PaymentMethod,
        ReferenceNumber: PaymentMethod === "GCash" ? ReferenceNumber : null,
        CashReceived: PaymentMethod === "Cash" ? CashReceived : null,
        ChangeAmount: PaymentMethod === "Cash" ? ChangeAmount : 0,
      });

      alert("Payment saved successfully.");

      setSalesID("");
      setPaymentDate("");
      setAmountPaid("");
      setPaymentMethod("Cash");
      setReferenceNumber("");
      setCashReceived("");
      setChangeAmount("");

      fetchPayments();
      fetchUnpaidSales();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payments</h1>

      <div style={cardStyle}>
        <h2>Record Payment</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Sale</label>
            <select value={SalesID} onChange={handleSaleChange} style={inputStyle}>
              <option value="">Select Sale</option>
              {sales.map((sale) => (
                <option key={sale.SalesID} value={sale.SalesID}>
                  Sale #{sale.SalesID} - ₱{Number(sale.TotalAmount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Payment Date</label>
            <input
              type="date"
              value={PaymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Amount Paid</label>
            <input
              type="number"
              value={AmountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              style={inputStyle}
              placeholder="Amount paid"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Payment Method</label>
            <select
              value={PaymentMethod}
              onChange={handlePaymentMethodChange}
              style={inputStyle}
            >
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
            </select>
          </div>

          {PaymentMethod === "GCash" && (
            <div style={{ marginBottom: "10px" }}>
              <label>Reference Number</label>
              <input
                type="text"
                value={ReferenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                style={inputStyle}
                placeholder="Enter reference number"
              />
            </div>
          )}

          {PaymentMethod === "Cash" && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Cash Received</label>
                <input
                  type="number"
                  value={CashReceived}
                  onChange={handleCashReceivedChange}
                  style={inputStyle}
                  placeholder="Enter cash received"
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>Change Amount</label>
                <input
                  type="number"
                  value={ChangeAmount}
                  readOnly
                  style={inputStyle}
                />
              </div>
            </>
          )}

          <button type="submit" style={greenBtn}>
            Save Payment
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2>Payments List</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Payment ID</th>
              <th style={thStyle}>Sales ID</th>
              <th style={thStyle}>Payment Date</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Method</th>
              <th style={thStyle}>Reference</th>
              <th style={thStyle}>Cash Received</th>
              <th style={thStyle}>Change</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.PaymentID}>
                  <td style={tdStyle}>{payment.PaymentID}</td>
                  <td style={tdStyle}>{payment.SalesID}</td>
                  <td style={tdStyle}>{payment.PaymentDate}</td>
                  <td style={tdStyle}>₱{Number(payment.AmountPaid).toFixed(2)}</td>
                  <td style={tdStyle}>{payment.PaymentMethod}</td>
                  <td style={tdStyle}>{payment.ReferenceNumber || "-"}</td>
                  <td style={tdStyle}>
                    {payment.CashReceived ? Number(payment.CashReceived).toFixed(2) : "-"}
                  </td>
                  <td style={tdStyle}>
                    {payment.ChangeAmount ? Number(payment.ChangeAmount).toFixed(2) : "0.00"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tdStyle} colSpan="8">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  background: "#f2f2f2",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

const greenBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Payments;