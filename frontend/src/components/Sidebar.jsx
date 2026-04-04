import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        width: "290px",
        background:
          "linear-gradient(180deg, #2b1712 0%, #4a251b 42%, #6b3426 100%)",
        color: "white",
        padding: "24px 18px",
        minHeight: "100vh",
        boxSizing: "border-box",
        boxShadow: "8px 0 24px rgba(43, 23, 18, 0.18)",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        borderRight: "1px solid rgba(255,255,255,0.06)"
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px"
        }}
      >
        <motion.div
          whileHover={{ scale: 1.04, rotate: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: "126px",
            height: "126px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #fffaf5, #f3e1d1)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
            marginBottom: "12px",
            padding: "10px"
          }}
        >
          <img
            src={logo}
            alt="Lovier's Meat Shop"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%"
            }}
          />
        </motion.div>

        <h2
          style={{
            marginBottom: "6px",
            fontSize: "26px",
            textAlign: "center",
            fontWeight: "800",
            letterSpacing: "0.4px"
          }}
        >
          Lovier's Meatshop
        </h2>

        <p
          style={{
            marginBottom: "18px",
            opacity: 0.9,
            textAlign: "center",
            fontSize: "14px",
            color: "#f4d6b7"
          }}
        >
          Logged in as: <strong>{role}</strong>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              whileHover={{ x: 4 }}
            >
              <Link
                to={item.path}
                style={{
                  display: "block",
                  padding: "13px 16px",
                  textDecoration: "none",
                  color: "white",
                  background: isActive
                    ? "linear-gradient(90deg, #8c3f2f 0%, #b14d36 100%)"
                    : "rgba(255,255,255,0.04)",
                  borderRadius: "14px",
                  fontWeight: isActive ? "700" : "500",
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: isActive
                    ? "0 8px 18px rgba(140,63,47,0.35)"
                    : "none",
                  transition: "all 0.25s ease"
                }}
              >
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "13px",
          background: "linear-gradient(90deg, #b93224 0%, #d14a38 100%)",
          color: "white",
          border: "none",
          borderRadius: "14px",
          cursor: "pointer",
          fontWeight: "800",
          fontSize: "15px",
          boxShadow: "0 8px 18px rgba(185,50,36,0.25)"
        }}
      >
        Logout
      </motion.button>
    </motion.div>
  );
}

export default Sidebar;