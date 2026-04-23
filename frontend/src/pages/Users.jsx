import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    Username: "",
    Password: "",
    Email: "",
    Contact: "",
    Role: ""
  });

  const API = "http://localhost:5000";

  const user = JSON.parse(localStorage.getItem("user"));
  const role = (user?.Role || "").toLowerCase().trim();

  // =======================
  // FETCH USERS
  // =======================
  const fetchUsers = () => {
    if (!role) return;

    fetch(`${API}/api/users?role=${encodeURIComponent(role)}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));
  };

  // =======================
  // FETCH LOGS (FIXED)
  // =======================
  const fetchLogs = () => {
    fetch(`${API}/api/users/logs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Logs error:", data);
          setLogs([]);
        }
      })
      .catch(err => {
        console.error(err);
        setLogs([]);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, [role]);

  // =======================
  // ACTIONS
  // =======================
  const toggleUser = (id) => {
    fetch(`${API}/api/users/toggle/${id}`, { method: "PUT" })
      .then(() => fetchUsers());
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;

    fetch(`${API}/api/users/${id}`, { method: "DELETE" })
      .then(() => fetchUsers());
  };

  const createUser = () => {
    if (!form.Username || !form.Password || !form.Email || !form.Contact || !form.Role) {
      alert("All fields are required.");
      return;
    }

    if (!/^\d{11}$/.test(form.Contact)) {
      alert("Contact must be exactly 11 digits.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.Email)) {
      alert("Invalid email format.");
      return;
    }

    fetch(`${API}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Username: form.Username,
        Password: form.Password,
        Email: form.Email,
        Contact: form.Contact,
        Role: form.Role,
        creatorRole: role
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);

        setShowModal(false);
        setForm({
          Username: "",
          Password: "",
          Email: "",
          Contact: "",
          Role: ""
        });

        fetchUsers();
      });
  };

  return (
    <div style={{ padding: "30px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Users</h2>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#28a745",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Create Account
        </button>
      </div>

      {/* USERS TABLE */}
      <div style={card}>
        <table style={table}>
          <thead style={thead}>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Contact</th>
              <th style={th}>Role</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.UserID}>
                <td style={td}>{u.Username}</td>
                <td style={td}>{u.Email}</td>
                <td style={td}>{u.Contact}</td>
                <td style={td}>{u.Role}</td>

                <td style={td}>
                  <span style={{
                    color: u.isActive ? "#28a745" : "#dc3545",
                    fontWeight: "bold"
                  }}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td style={td}>
                  <button
                    onClick={() => toggleUser(u.UserID)}
                    style={{
                      marginRight: "8px",
                      background: u.isActive ? "#dc3545" : "#28a745",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>

                  {localStorage.getItem("UserID") != u.UserID && (
                    <button
                      onClick={() => deleteUser(u.UserID)}
                      style={{
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTIVITY LOGS */}
      <h2 style={{ marginTop: "40px" }}>Activity Logs</h2>

      <div style={card}>
        <table style={table}>
          <thead style={thead}>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Contact</th>
              <th style={th}>Login Time</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(logs) && logs.map((log, i) => (
              <tr key={i}>
                <td style={td}>{log.Username}</td>
                <td style={td}>{log.Email}</td>
                <td style={td}>{log.Contact}</td>
                <td style={td}>
                  {new Date(log.LoginTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Create Account</h3>

            <input
              style={input}
              placeholder="Username"
              value={form.Username}
              onChange={e => setForm({ ...form, Username: e.target.value })}
            />

            <input
              style={input}
              type="password"
              placeholder="Password"
              value={form.Password}
              onChange={e => setForm({ ...form, Password: e.target.value })}
            />

            <input
              style={input}
              placeholder="Email"
              value={form.Email}
              onChange={e => setForm({ ...form, Email: e.target.value })}
            />

            <input
              style={input}
              placeholder="Contact"
              maxLength="11"
              value={form.Contact}
              onChange={e => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                if (onlyNumbers.length <= 11) {
                  setForm({ ...form, Contact: onlyNumbers });
                }
              }}
            />

            <select
              style={input}
              value={form.Role}
              onChange={e => setForm({ ...form, Role: e.target.value })}
            >
              <option value="">Select Role</option>

              {role === "super admin" ? (
                <>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </>
              ) : (
                <>
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </>
              )}
            </select>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button style={greenBtn} onClick={createUser}>Create</button>
              <button style={grayBtn} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const table = { width: "100%", borderCollapse: "collapse" };
const thead = { background: "#8B3A2B", color: "white" };
const th = { padding: "12px", textAlign: "left" };
const td = { padding: "12px", borderBottom: "1px solid #eee" };

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const modalBox = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "320px",
  display: "flex",
  flexDirection: "column"
};

const input = {
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const greenBtn = {
  background: "#28a745",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
  flex: 1
};

const grayBtn = {
  background: "#6c757d",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
  flex: 1
};

export default Users;