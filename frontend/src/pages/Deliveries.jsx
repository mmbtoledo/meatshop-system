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
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
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
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!DeliveryDate || !SupplierID || items.length === 0) {
      setMessage("Please complete the form.");
      return;
    }

    for (let item of items) {
      if (!item.ProductID || !item.Quantity || !item.CostPrice) {
        setMessage("Please fill in all delivery item fields.");
        return;
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/deliveries", {
        DeliveryDate,
        SupplierID,
        items
      });

      setMessage(res.data.message);
      clearForm();
      fetchDeliveries();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to save delivery.");
    }
  };

  // group rows by DeliveryID for display
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
      <h1 style={{ marginBottom: "20px" }}>Deliveries Management</h1>

      <div style={boxStyle}>
        <h2>Add Delivery</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Delivery Date</label>
            <input
              type="date"
              value={DeliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Supplier</label>
            <select
              value={SupplierID}
              onChange={(e) => setSupplierID(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
          </div>

          <h3>Delivery Items</h3>

          {items.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "12px"
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <label>Product</label>
                <select
                  value={item.ProductID}
                  onChange={(e) => handleItemChange(index, "ProductID", e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.ProductID} value={product.ProductID}>
                      {product.ProductName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>Quantity</label>
                <input
                  type="number"
                  value={item.Quantity}
                  onChange={(e) => handleItemChange(index, "Quantity", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>Cost Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.CostPrice}
                  onChange={(e) => handleItemChange(index, "CostPrice", e.target.value)}
                  style={inputStyle}
                />
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  style={removeButtonStyle}
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addItemRow} style={secondaryButtonStyle}>
            + Add Another Product
          </button>

          <div style={{ marginTop: "15px" }}>
            <button type="submit" style={primaryButtonStyle}>
              Save Delivery
            </button>

            <button type="button" onClick={clearForm} style={clearButtonStyle}>
              Clear
            </button>
          </div>
        </form>

        {message && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</p>}
      </div>

      <div style={boxStyle}>
        <h2>Delivery Records</h2>

        {Object.values(groupedDeliveries).length > 0 ? (
          Object.values(groupedDeliveries).map((delivery) => (
            <div
              key={delivery.DeliveryID}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px"
              }}
            >
              <h3>Delivery #{delivery.DeliveryID}</h3>
              <p><strong>Date:</strong> {delivery.DeliveryDate}</p>
              <p><strong>Supplier:</strong> {delivery.SupplierName}</p>

              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Quantity</th>
                    <th style={thStyle}>Cost Price</th>
                    <th style={thStyle}>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {delivery.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{item.ProductName}</td>
                      <td style={tdStyle}>{item.Quantity}</td>
                      <td style={tdStyle}>₱{item.CostPrice}</td>
                      <td style={tdStyle}>₱{item.TotalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No deliveries found.</p>
        )}
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

const primaryButtonStyle = {
  backgroundColor: "green",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "10px"
};

const secondaryButtonStyle = {
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px"
};

const clearButtonStyle = {
  backgroundColor: "#7f8c8d",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer"
};

const removeButtonStyle = {
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px"
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f2f2f2",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px"
};

export default Deliveries;