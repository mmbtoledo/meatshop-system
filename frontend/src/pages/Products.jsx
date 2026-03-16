import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [ProductName, setProductName] = useState("");
  const [CurrentPrice, setCurrentPrice] = useState("");
  const [StockQty, setStockQty] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setMessage("Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const clearForm = () => {
    setProductName("");
    setCurrentPrice("");
    setStockQty("");
    setEditId(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ProductName || !CurrentPrice || !StockQty) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      if (editId === null) {
        const res = await axios.post("http://localhost:5000/api/products", {
          ProductName,
          CurrentPrice,
          StockQty
        });
        setMessage(res.data.message);
      } else {
        const res = await axios.put(`http://localhost:5000/api/products/${editId}`, {
          ProductName,
          CurrentPrice,
          StockQty
        });
        setMessage(res.data.message);
      }

      clearForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setMessage("Failed to save product.");
    }
  };

  const handleEdit = (product) => {
    console.log("Editing product:", product);

    setEditId(product.ProductID);
    setProductName(product.ProductName || "");
    setCurrentPrice(product.CurrentPrice || "");
    setStockQty(product.StockQty || "");
    setMessage(`Now editing: ${product.ProductName}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/products/${id}`);
      setMessage(res.data.message);

      if (editId === id) {
        clearForm();
      }

      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setMessage("Failed to delete product.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Products Management</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        <h2>{editId === null ? "Add Product" : "Edit Product"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Product Name</label>
            <br />
            <input
              type="text"
              value={ProductName}
              onChange={(e) => setProductName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Current Price</label>
            <br />
            <input
              type="number"
              step="0.01"
              value={CurrentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Stock Quantity</label>
            <br />
            <input
              type="number"
              value={StockQty}
              onChange={(e) => setStockQty(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: editId === null ? "green" : "#f39c12",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            {editId === null ? "Add Product" : "Update Product"}
          </button>

          <button
            type="button"
            onClick={clearForm}
            style={{
              backgroundColor: "#7f8c8d",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Clear
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</p>
        )}
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <h2>Product List</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#ecf0f1" }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Product Name</th>
              <th style={tableHeaderStyle}>Price</th>
              <th style={tableHeaderStyle}>Stock</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.ProductID}>
                  <td style={tableCellStyle}>{product.ProductID}</td>
                  <td style={tableCellStyle}>{product.ProductName}</td>
                  <td style={tableCellStyle}>₱{product.CurrentPrice}</td>
                  <td style={tableCellStyle}>{product.StockQty}</td>
                  <td style={tableCellStyle}>
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      style={{
                        backgroundColor: "#3498db",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "8px"
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(product.ProductID)}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: "12px", textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "left"
};

const tableCellStyle = {
  padding: "12px",
  border: "1px solid #ddd"
};

export default Products;