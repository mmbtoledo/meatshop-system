import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

function Login() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        Username,
        Password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

// ✅ ADD THIS (for welcome popup)
      localStorage.setItem("username", res.data.user.Username);

      const role = res.data.user.Role;

      if (role === "Employee") {
        navigate("/products");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top left, rgba(196,154,108,0.18), transparent 22%), radial-gradient(circle at bottom right, rgba(140,63,47,0.14), transparent 24%), linear-gradient(135deg, #f8f4f1 0%, #efe7df 100%)",
        padding: "24px"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        style={{
          width: "430px",
          background: "linear-gradient(145deg, #fffdfb, #f7efe8)",
          padding: "34px",
          borderRadius: "24px",
          boxShadow: "0 16px 40px rgba(74, 37, 27, 0.14)",
          border: "1px solid rgba(196,154,108,0.18)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <motion.div
            whileHover={{ scale: 1.04, rotate: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "inline-flex",
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              justifyContent: "center",
              alignItems: "center",
              background: "linear-gradient(145deg, #fffaf5, #f3e1d1)",
              boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
              marginBottom: "14px",
              padding: "8px"
            }}
          >
            <img
              src={logo}
              alt="Lovier's Meatshop"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "50%"
              }}
            />
          </motion.div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: "800",
              color: "#4a251b",
              letterSpacing: "0.4px"
            }}
          >
            Login
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#7a5a4f",
              fontSize: "15px"
            }}
          >
            Welcome to Lovier's Meatshop Management System
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              placeholder="Enter your username"
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={buttonStyle}
          >
            Login
          </motion.button>
        </form>

        {message && (
          <p
            style={{
              color: "#d32f2f",
              marginTop: "16px",
              fontWeight: "700",
              textAlign: "center"
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "18px", textAlign: "center" }}>
          <Link
            to="/forgot-password"
            style={{
              color: "#8c3f2f",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            Forgot Password?
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#4a251b",
  fontWeight: "700"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #d9c7b8",
  boxSizing: "border-box",
  outline: "none",
  backgroundColor: "#fffaf5",
  transition: "all 0.25s ease",
  fontSize: "15px"
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "linear-gradient(90deg, #7a3525 0%, #a54531 100%)",
  color: "white",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "800",
  fontSize: "16px",
  boxShadow: "0 10px 22px rgba(122,53,37,0.22)"
};

export default Login;