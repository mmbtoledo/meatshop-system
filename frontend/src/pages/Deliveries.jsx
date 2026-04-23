import { useEffect, useState } from "react";
import axios from "axios";

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [DeliveryDate, setDeliveryDate] = useState("");
  const [SupplierID, setSupplierID] = useState("");
  const [items, setItems] = useState([
    { ProductID: "", Quantity: "", CostPrice: "" }
  ]);

  const [message, setMessage] = useState("");

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/deliveries");
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch deliveries.");
    }
  };

  const fetchSuppliers = async () => {
    const res = await axios.get("http://localhost:5000/api/suppliers");
    setSuppliers(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchDeliveries();
    fetchSuppliers();
    fetchProducts();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems([...items, { ProductID: "", Quantity: "", CostPrice: "" }]);
  };

  const removeItemRow = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const clearForm = () => {
    setDeliveryDate("");
    setSupplierID("");
    setItems([{ ProductID: "", Quantity: "", CostPrice: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!DeliveryDate || !SupplierID || items.length === 0) {
      setMessage("Please complete the form.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (DeliveryDate < today) {
      setMessage("Delivery date cannot be in the past.");
      return;
    }

    for (let item of items) {
      if (!item.ProductID || !item.Quantity || !item.CostPrice) {
        setMessage("Please fill in all delivery item fields.");
        return;
      }

      if (
        isNaN(item.Quantity) ||
        Number(item.Quantity) <= 0 ||
        isNaN(item.CostPrice) ||
        Number(item.CostPrice) <= 0
      ) {
        setMessage("Quantity and Cost Price must be greater than 0.");
        return;
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/deliveries", {
        DeliveryDate,
        SupplierID,
        items
      });

      clearForm();
      setMessage(res.data.message);

      setTimeout(() => setMessage(""), 3000);

      fetchDeliveries();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to save delivery.");
    }
  };

  const groupedDeliveries = deliveries.reduce((acc, row) => {
    if (!acc[row.DeliveryID]) {
      acc[row.DeliveryID] = {
        DeliveryID: row.DeliveryID,
        DeliveryDate: row.DeliveryDate,
        SupplierName: row.SupplierName,
        items: []
      };
    }

    acc[row.DeliveryID].items.push({
      ProductName: row.ProductName,
      Quantity: row.Quantity,
      CostPrice: row.CostPrice,
      TotalCost: row.TotalCost
    });

    return acc;
  }, {});

  return (
    <div style={{ padding: "30px" }}>
      <h1>Deliveries Management</h1>

      {/* FORM */}
      <div style={cardStyle}>
        <h2>Add Delivery</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={DeliveryDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDeliveryDate(e.target.value)}
            style={inputStyle}
          />

          <select
            value={SupplierID}
            onChange={(e) => setSupplierID(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.SupplierID} value={s.SupplierID}>
                {s.SupplierName}
              </option>
            ))}
          </select>

          {items.map((item, index) => (
            <div key={index} style={itemBox}>
              <select
                value={item.ProductID}
                onChange={(e) =>
                  handleItemChange(index, "ProductID", e.target.value)
                }
                style={inputStyle}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.ProductID} value={p.ProductID}>
                    {p.ProductName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.Quantity}
                onChange={(e) =>
                  handleItemChange(index, "Quantity", e.target.value)
                }
                style={inputStyle}
                placeholder="Quantity"
              />

              <input
                type="number"
                min="1"
                value={item.CostPrice}
                onChange={(e) =>
                  handleItemChange(index, "CostPrice", e.target.value)
                }
                style={inputStyle}
                placeholder="Cost Price"
              />

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  style={redBtn}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addItemRow} style={blueBtn}>
            + Add Another Product
          </button>

          <br /><br />

          <button type="submit" style={greenBtn}>
            Save Delivery
          </button>

          <button type="button" onClick={clearForm} style={grayBtn}>
            Clear
          </button>
        </form>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </div>

      {/* RECORDS */}
      <div style={cardStyle}>
        <h2>Delivery Records</h2>

        {Object.values(groupedDeliveries).map((d) => (
          <div key={d.DeliveryID} style={recordBox}>
            <h3>Delivery #{d.DeliveryID}</h3>
            <p>Date: {d.DeliveryDate}</p>
            <p>Supplier: {d.SupplierName}</p>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Qty</th>
                  <th style={thStyle}>Cost</th>
                  <th style={thStyle}>Total</th>
                </tr>
              </thead>
              <tbody>
                {d.items.map((i, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{i.ProductName}</td>
                    <td style={tdStyle}>{i.Quantity}</td>
                    <td style={tdStyle}>₱{i.CostPrice}</td>
                    <td style={tdStyle}>₱{i.TotalCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ UI FIX ONLY
const cardStyle = {
  background: "#f9f9f9",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  marginBottom: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const itemBox = {
  border: "1px solid #ddd",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px"
};

const recordBox = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px"
};

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { background: "#8B3E2F", color: "#fff", padding: "10px" };
const tdStyle = { padding: "10px", border: "1px solid #ddd" };

const greenBtn = { background: "#28a745", color: "#fff", padding: "10px", borderRadius: "6px", marginRight: "10px" };
const grayBtn = { background: "#6c757d", color: "#fff", padding: "10px", borderRadius: "6px" };
const blueBtn = { background: "#007bff", color: "#fff", padding: "10px", borderRadius: "6px", marginBottom: "10px" };
const redBtn = { background: "#dc3545", color: "#fff", padding: "6px 10px", borderRadius: "6px" };

export default Deliveries;