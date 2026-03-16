import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [Username, setUsername] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        Username,
        NewPassword
      });

      setMessage(res.data.message);
      setUsername("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5"
      }}
    >
      <div
        style={{
          width: "420px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Forgot Password</h1>

        <form onSubmit={handleReset}>
          <div style={{ marginBottom: "15px" }}>
            <label>Username</label>
            <input
              type="text"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>New Password</label>
            <input
              type="password"
              value={NewPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#5c2d1f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", fontWeight: "600", color: "#8c3f2f" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "15px" }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

export default ForgotPassword;