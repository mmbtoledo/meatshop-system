import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  const API = "http://localhost:5000";

  useEffect(() => {
    loadUsers();
    loadLogs();
  }, []);

  const loadUsers = () => {
    fetch(`${API}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));
  };

  const loadLogs = () => {
    fetch(`${API}/api/users/logs`)
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.log(err));
  };

  const toggleUser = (id) => {
    fetch(`${API}/api/users/toggle/${id}`, {
      method: "PUT"
    }).then(loadUsers);
  };

  const deleteUser = (id) => {
    fetch(`${API}/api/users/${id}`, {
      method: "DELETE"
    }).then(loadUsers);
  };

  return (
    <div style={{ padding: "30px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Users</h2>
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
            {users.map((user) => (
              <tr key={user.UserID}>
                <td style={td}>{user.Username}</td>
                <td style={td}>{user.Email}</td>
                <td style={td}>{user.Contact}</td>
                <td style={td}>{user.Role}</td>

                <td style={td}>
                  <span
                    style={{
                      color: user.isActive ? "#28a745" : "#dc3545",
                      fontWeight: "bold"
                    }}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td style={td}>
                  <button
                    onClick={() => toggleUser(user.UserID)}
                    style={{
                      marginRight: "8px",
                      background: user.isActive ? "#dc3545" : "#28a745",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>

                  {/* prevent deleting yourself */}
                  {localStorage.getItem("UserID") != user.UserID && (
                    <button
                      onClick={() => deleteUser(user.UserID)}
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
            {logs.map((log, i) => (
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
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

const thead = {
  background: "#8B3A2B",
  color: "white"
};

const th = {
  padding: "12px",
  textAlign: "left"
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #eee"
};

export default Users;