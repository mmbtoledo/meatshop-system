import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.Role;

  const allMenuItems = [
    { path: "/products", label: "Products", roles: ["Employee", "Admin", "Super Admin"] },
    { path: "/deliveries", label: "Deliveries", roles: ["Employee", "Admin", "Super Admin"] },
    { path: "/sales", label: "Sales", roles: ["Employee", "Admin", "Super Admin"] },
    { path: "/payments", label: "Payments", roles: ["Employee", "Admin", "Super Admin"] },

    { path: "/", label: "Dashboard", roles: ["Admin", "Super Admin"] },
    { path: "/categories", label: "Categories", roles: ["Admin", "Super Admin"] },
    { path: "/suppliers", label: "Suppliers", roles: ["Admin", "Super Admin"] },
    { path: "/expenses", label: "Expenses", roles: ["Admin", "Super Admin"] },
    { path: "/losses", label: "Losses", roles: ["Admin", "Super Admin"] },
    { path: "/reports", label: "Reports", roles: ["Admin", "Super Admin"] },

    { path: "/users", label: "Users", roles: ["Super Admin"] },
    { path: "/system", label: "System", roles: ["Super Admin"] }
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "280px",
        background: "linear-gradient(180deg, #2e1b16 0%, #5c2d1f 100%)",
        color: "white",
        padding: "24px 16px",
        minHeight: "100vh",
        boxSizing: "border-box",
        boxShadow: "4px 0 10px rgba(0,0,0,0.12)"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <img
          src={logo}
          alt="Lovier's Meat Shop"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "contain",
            borderRadius: "50%",
            backgroundColor: "white",
            padding: "6px"
          }}
        />
      </div>

      <h2 style={{ marginBottom: "6px", fontSize: "24px", textAlign: "center", fontWeight: "800" }}>
        Lovier's Meatshop
      </h2>

      <p style={{ marginBottom: "20px", opacity: 0.9, textAlign: "center", fontSize: "14px" }}>
        Logged in as: <strong>{role}</strong>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "block",
              padding: "12px 16px",
              textDecoration: "none",
              color: "white",
              backgroundColor: location.pathname === item.path ? "#8c3f2f" : "transparent",
              borderRadius: "10px",
              fontWeight: location.pathname === item.path ? "700" : "500",
              border: location.pathname === item.path ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent"
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "12px",
          backgroundColor: "#c0392b",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "700"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;