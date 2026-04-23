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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ProductName.trim()) return alert("Product name is required.");
    if (CurrentPrice === "" || isNaN(CurrentPrice) || Number(CurrentPrice) <= 0)
      return alert("Price must be greater than 0.");
    if (StockQty === "" || isNaN(StockQty) || Number(StockQty) <= 0)
      return alert("Stock must be greater than 0.");
    if (!CategoryID) return alert("Category is required.");

    const payload = { ProductName, CurrentPrice, StockQty, CategoryID };

    if (editingId) {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, payload);
      alert("Product updated successfully.");
    } else {
      await axios.post("http://localhost:5000/api/products", payload);
      alert("Product added successfully.");
    }

    handleClear();
    fetchProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p.RealProductID);
    setProductName(p.ProductName);
    setCurrentPrice(p.CurrentPrice);
    setStockQty(p.StockQty);
    setCategoryID(p.CategoryID);
  };

  const handleDelete = (id) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await axios.delete(`http://localhost:5000/api/products/${selectedDeleteId}`);
    alert("Deleted");
    setShowDeleteModal(false);
    fetchProducts();
  };

  const handleClear = () => {
    setProductName("");
    setCurrentPrice("");
    setStockQty("");
    setCategoryID("");
    setEditingId(null);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Products Management</h1>

      <div style={cardStyle}>
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit}>
          <input placeholder="Product Name" value={ProductName} onChange={e => setProductName(e.target.value)} style={inputStyle}/>
          <input placeholder="Price" type="number" value={CurrentPrice} onChange={e => setCurrentPrice(e.target.value)} style={inputStyle}/>
          <input placeholder="Stock" type="number" value={StockQty} onChange={e => setStockQty(e.target.value)} style={inputStyle}/>

          <select value={CategoryID} onChange={e => setCategoryID(e.target.value)} style={inputStyle}>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
            ))}
          </select>

          <button type="submit" style={greenBtn}>{editingId ? "Update" : "Add"}</button>
          <button type="button" onClick={handleClear} style={grayBtn}>Clear</button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2>Product List</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.RealProductID}>
                <td style={tdStyle}>{p.ProductID}</td>
                <td style={tdStyle}>{p.ProductName}</td>
                <td style={tdStyle}>₱{Number(p.CurrentPrice).toFixed(2)}</td>
                <td style={tdStyle}>{p.StockQty}</td>
                <td style={tdStyle}>{p.CategoryName}</td>
                <td style={tdStyle}>
                  <button style={blueBtn} onClick={() => handleEdit(p)}>Edit</button>
                  <button style={redBtn} onClick={() => handleDelete(p.RealProductID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <p>Delete this product?</p>
            <button style={redBtn} onClick={confirmDelete}>Yes</button>
            <button style={grayBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// 🔥 UI FIXED STYLES
const cardStyle = { background:"#f9f9f9", padding:"20px", borderRadius:"12px", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", marginBottom:"20px" };
const inputStyle = { width:"100%", padding:"10px", marginBottom:"10px", borderRadius:"6px", border:"1px solid #ccc" };
const tableStyle = { width:"100%", borderCollapse:"collapse" };
const thStyle = { background:"#8B3E2F", color:"#fff", padding:"12px" };
const tdStyle = { padding:"10px", border:"1px solid #ddd" };

const greenBtn = { background:"#28a745", color:"#fff", padding:"10px", borderRadius:"6px", marginRight:"10px" };
const grayBtn = { background:"#6c757d", color:"#fff", padding:"10px", borderRadius:"6px" };
const blueBtn = { background:"#007bff", color:"#fff", padding:"8px", borderRadius:"6px", marginRight:"8px" };
const redBtn = { background:"#dc3545", color:"#fff", padding:"8px", borderRadius:"6px" };

const modalOverlay = { position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center" };
const modalBox = { background:"#fff", padding:"20px", borderRadius:"10px" };

export default Products;