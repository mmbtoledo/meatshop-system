import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [ProductName, setProductName] = useState("");
  const [CurrentPrice, setCurrentPrice] = useState("");
  const [StockQty, setStockQty] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Fetch products error:", error);
      alert("Failed to fetch products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Fetch categories error:", error);
      alert("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ProductName.trim()) {
      alert("Product name is required.");
      return;
    }

    if (CurrentPrice === "") {
      alert("Current price is required.");
      return;
    }

    if (StockQty === "") {
      alert("Stock quantity is required.");
      return;
    }

    if (!CategoryID) {
      alert("Category is required.");
      return;
    }

    try {
      const payload = {
        ProductName,
        CurrentPrice,
        StockQty,
        CategoryID,
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, payload);
        alert("Product updated successfully.");
      } else {
        await axios.post("http://localhost:5000/api/products", payload);
        alert("Product added successfully.");
      }

      handleClear();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.ProductID);
    setProductName(product.ProductName);
    setCurrentPrice(product.CurrentPrice);
    setStockQty(product.StockQty);
    setCategoryID(product.CategoryID);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      alert("Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleClear = () => {
    setProductName("");
    setCurrentPrice("");
    setStockQty("");
    setCategoryID("");
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products Management</h1>

      <div style={cardStyle}>
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Product Name</label>
            <input
              type="text"
              value={ProductName}
              onChange={(e) => setProductName(e.target.value)}
              style={inputStyle}
              placeholder="Enter product name"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Current Price</label>
            <input
              type="number"
              value={CurrentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              style={inputStyle}
              placeholder="Enter current price"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Stock Quantity</label>
            <input
              type="number"
              value={StockQty}
              onChange={(e) => setStockQty(e.target.value)}
              style={inputStyle}
              placeholder="Enter stock quantity"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Category</label>
            <select
              value={CategoryID}
              onChange={(e) => setCategoryID(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" style={greenBtn}>
            {editingId ? "Update Product" : "Add Product"}
          </button>
          <button type="button" onClick={handleClear} style={grayBtn}>
            Clear
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2>Product List</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Product Name</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.ProductID}>
                  <td style={tdStyle}>{product.ProductID}</td>
                  <td style={tdStyle}>{product.ProductName}</td>
                  <td style={tdStyle}>₱{Number(product.CurrentPrice).toFixed(2)}</td>
                  <td style={tdStyle}>{product.StockQty}</td>
                  <td style={tdStyle}>{product.CategoryName}</td>
                  <td style={tdStyle}>
                    <button style={blueBtn} onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button
                      style={redBtn}
                      onClick={() => handleDelete(product.ProductID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tdStyle} colSpan="6">
                  No products found.
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
  marginRight: "10px",
};

const grayBtn = {
  background: "gray",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const blueBtn = {
  background: "#2196f3",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "8px",
};

const redBtn = {
  background: "#f44336",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Products;