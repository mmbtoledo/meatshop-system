import { useEffect, useState } from "react";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [CategoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setMessage("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const clearForm = () => {
    setCategoryName("");
    setEditId(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!CategoryName) {
      setMessage("Please enter category name.");
      return;
    }

    try {
      if (editId === null) {
        const res = await axios.post("http://localhost:5000/api/categories", {
          CategoryName
        });
        setMessage(res.data.message);
      } else {
        const res = await axios.put(`http://localhost:5000/api/categories/${editId}`, {
          CategoryName
        });
        setMessage(res.data.message);
      }

      clearForm();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      setMessage("Failed to save category.");
    }
  };

  const handleEdit = (category) => {
    setEditId(category.CategoryID);
    setCategoryName(category.CategoryName || "");
    setMessage(`Now editing: ${category.CategoryName}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setMessage(res.data.message);

      if (editId === id) {
        clearForm();
      }

      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setMessage("Failed to delete category.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Categories Management</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        <h2>{editId === null ? "Add Category" : "Edit Category"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Category Name</label>
            <br />
            <input
              type="text"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
            {editId === null ? "Add Category" : "Update Category"}
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
        <h2>Category List</h2>

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
              <th style={tableHeaderStyle}>Category Name</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.CategoryID}>
                  <td style={tableCellStyle}>{category.CategoryID}</td>
                  <td style={tableCellStyle}>{category.CategoryName}</td>
                  <td style={tableCellStyle}>
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
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
                      onClick={() => handleDelete(category.CategoryID)}
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
                <td colSpan="3" style={{ padding: "12px", textAlign: "center" }}>
                  No categories found
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

export default Categories;