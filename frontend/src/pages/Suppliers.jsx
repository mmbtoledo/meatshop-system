import { useEffect, useState } from "react";
import axios from "axios";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [SupplierName, setSupplierName] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setMessage("Failed to fetch suppliers.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const clearForm = () => {
    setSupplierName("");
    setContactNumber("");
    setEditId(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!SupplierName || !ContactNumber) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!/^\d{11}$/.test(ContactNumber)) {
      setMessage("Contact number must be exactly 11 digits.");
      return;
    }

    try {
      let res;

      if (editId === null) {
        res = await axios.post("http://localhost:5000/api/suppliers", {
          SupplierName,
          ContactNumber
        });
      } else {
        res = await axios.put(`http://localhost:5000/api/suppliers/${editId}`, {
          SupplierName,
          ContactNumber
        });
      }

      clearForm();
      setMessage(res.data.message);

      setTimeout(() => {
        setMessage("");
      }, 3000);

      fetchSuppliers();
    } catch (err) {
      console.error("Error saving supplier:", err);
      setMessage(err.response?.data?.error || "Failed to save supplier.");
    }
  };

  const handleEdit = (supplier) => {
    // 🔥 FIXED (use real ID)
    setEditId(supplier.RealSupplierID);
    setSupplierName(supplier.SupplierName || "");
    setContactNumber(supplier.ContactNumber || "");
    setMessage(`Now editing: ${supplier.SupplierName}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/suppliers/${id}`);

      setMessage(res.data.message);

      // 🔥 refresh list
      fetchSuppliers();

    } catch (err) {
      console.error("Error deleting supplier:", err);
      setMessage(err.response?.data?.error || "Failed to delete supplier.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Suppliers Management</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}
      >
        <h2>{editId === null ? "Add Supplier" : "Edit Supplier"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Supplier Name</label>
            <br />
            <input
              type="text"
              value={SupplierName}
              onChange={(e) => setSupplierName(e.target.value)}
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
            <label>Contact Number</label>
            <br />
            <input
              type="text"
              maxLength="11"
              value={ContactNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setContactNumber(value);
              }}
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
            {editId === null ? "Add Supplier" : "Update Supplier"}
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
        <h2>Supplier List</h2>

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
              <th style={tableHeaderStyle}>Supplier Name</th>
              <th style={tableHeaderStyle}>Contact Number</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.RealSupplierID}>
                  {/* ✅ DISPLAY ID ONLY */}
                  <td style={tableCellStyle}>{supplier.SupplierID}</td>
                  <td style={tableCellStyle}>{supplier.SupplierName}</td>
                  <td style={tableCellStyle}>{supplier.ContactNumber}</td>
                  <td style={tableCellStyle}>
                    <button
                      type="button"
                      onClick={() => handleEdit(supplier)}
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
                      onClick={() => handleDelete(supplier.RealSupplierID)}
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
                <td colSpan="4" style={{ padding: "12px", textAlign: "center" }}>
                  No suppliers found
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

export default Suppliers;