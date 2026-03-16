import { useEffect, useState } from "react";
import axios from "axios";

function Losses() {
  const [losses, setLosses] = useState([]);
  const [products, setProducts] = useState([]);
  const [ProductID, setProductID] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [LossType, setLossType] = useState("Spoilage");
  const [DateRecorded, setDateRecorded] = useState("");
  const [message, setMessage] = useState("");

  const fetchLosses = async () => {
    const res = await axios.get("http://localhost:5000/api/losses");
    setLosses(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchLosses();
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/losses", {
        ProductID,
        Quantity,
        LossType,
        DateRecorded
      });

      setMessage(res.data.message);
      setProductID("");
      setQuantity("");
      setLossType("Spoilage");
      setDateRecorded("");
      fetchLosses();
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to record loss");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Losses</h1>

      <div style={boxStyle}>
        <h2>Record Loss</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Product</label>
            <select value={ProductID} onChange={(e) => setProductID(e.target.value)} style={inputStyle}>
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.ProductID} value={product.ProductID}>
                  {product.ProductName} (Stock: {product.StockQty})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Quantity</label>
            <input type="number" value={Quantity} onChange={(e) => setQuantity(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Loss Type</label>
            <select value={LossType} onChange={(e) => setLossType(e.target.value)} style={inputStyle}>
              <option value="Spoilage">Spoilage</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Date Recorded</label>
            <input type="date" value={DateRecorded} onChange={(e) => setDateRecorded(e.target.value)} style={inputStyle} />
          </div>

          <button type="submit" style={buttonStyle}>Save Loss</button>
        </form>

        {message && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p>}
      </div>

      <div style={boxStyle}>
        <h2>Loss List</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {losses.map((loss) => (
              <tr key={loss.LossID}>
                <td style={tdStyle}>{loss.LossID}</td>
                <td style={tdStyle}>{loss.ProductName}</td>
                <td style={tdStyle}>{loss.Quantity}</td>
                <td style={tdStyle}>{loss.LossType}</td>
                <td style={tdStyle}>{loss.DateRecorded}</td>
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

export default Losses;