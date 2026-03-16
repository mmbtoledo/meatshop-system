import { useEffect, useState } from "react";
import axios from "axios";

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ ProductID: "", Quantity: "" }]);
  const [message, setMessage] = useState("");

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Fetch sales error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItemRow = () => {
    setItems([...items, { ProductID: "", Quantity: "" }]);
  };

  const removeItemRow = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const clearForm = () => {
    setItems([{ ProductID: "", Quantity: "" }]);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let item of items) {
      if (!item.ProductID || !item.Quantity) {
        setMessage("Please complete all sale item fields.");
        return;
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/sales", {
        items
      });

      setMessage(res.data.message);
      clearForm();
      fetchSales();
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to save sale");
    }
  };

  const groupedSales = sales.reduce((acc, row) => {
    if (!acc[row.SalesID]) {
      acc[row.SalesID] = {
        SalesID: row.SalesID,
        SalesDate: row.SalesDate,
        items: []
      };
    }

    acc[row.SalesID].items.push({
      ProductName: row.ProductName,
      Quantity: row.Quantity,
      UnitPrice: row.UnitPrice,
      Subtotal: row.Subtotal
    });

    return acc;
  }, {});

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Sales</h1>

      <div style={boxStyle}>
        <h2>Record Sale</h2>

        <form onSubmit={handleSubmit}>
          <h3>Sale Items</h3>

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
                      {product.ProductName} (Stock: {product.StockQty}, Price: ₱{product.CurrentPrice})
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
              Save Sale
            </button>

            <button type="button" onClick={clearForm} style={clearButtonStyle}>
              Clear
            </button>
          </div>
        </form>

        {message && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</p>}
      </div>

      <div style={boxStyle}>
        <h2>Sales Records</h2>

        {Object.values(groupedSales).length > 0 ? (
          Object.values(groupedSales).map((sale) => (
            <div
              key={sale.SalesID}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px"
              }}
            >
              <h3>Sale #{sale.SalesID}</h3>
              <p><strong>Date:</strong> {sale.SalesDate}</p>

              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Quantity</th>
                    <th style={thStyle}>Unit Price</th>
                    <th style={thStyle}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{item.ProductName}</td>
                      <td style={tdStyle}>{item.Quantity}</td>
                      <td style={tdStyle}>₱{item.UnitPrice}</td>
                      <td style={tdStyle}>₱{item.Subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No sales found.</p>
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

export default Sales;