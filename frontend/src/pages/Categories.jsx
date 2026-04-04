import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [CategoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);

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
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!CategoryName.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/categories/${editingId}`, {
          CategoryName,
        });
        alert("Category updated successfully.");
      } else {
        await axios.post("http://localhost:5000/api/categories", {
          CategoryName,
        });
        alert("Category added successfully.");
      }

      setCategoryName("");
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "The Category already exists.");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.CategoryID);
    setCategoryName(category.CategoryName);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      alert("Category deleted successfully.");
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleClear = () => {
    setCategoryName("");
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Categories Management</h1>

      <div style={cardStyle}>
        <h2>{editingId ? "Edit Category" : "Add Category"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Category Name</label>
            <input
              type="text"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              style={inputStyle}
              placeholder="Enter category name"
            />
          </div>

          <button type="submit" style={greenBtn}>
            {editingId ? "Update Category" : "Add Category"}
          </button>
          <button type="button" onClick={handleClear} style={grayBtn}>
            Clear
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2>Category List</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Category Name</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.CategoryID}>
                  <td style={tdStyle}>{category.CategoryID}</td>
                  <td style={tdStyle}>{category.CategoryName}</td>
                  <td style={tdStyle}>
                    <button style={blueBtn} onClick={() => handleEdit(category)}>
                      Edit
                    </button>
                    <button
                      style={redBtn}
                      onClick={() => handleDelete(category.CategoryID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tdStyle} colSpan="3">
                  No categories found.
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

export default Categories;