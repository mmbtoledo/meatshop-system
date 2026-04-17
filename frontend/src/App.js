import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Deliveries from "./pages/Deliveries";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Losses from "./pages/Losses";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Users from "./pages/Users";

import "./App.css";

function ProtectedLayout({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.Role)) {
    if (user?.Role === "Employee") {
      return <Navigate to="/products" />;
    }

    if (user?.Role === "Admin" || user?.Role === "Super Admin") {
      return <Navigate to="/" />;
    }

    return <Navigate to="/login" />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <div className="app-content-inner">{children}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/products"
          element={
            <ProtectedLayout allowedRoles={["Employee", "Admin", "Super Admin"]}>
              <Products />
            </ProtectedLayout>
          }
        />

        <Route
          path="/deliveries"
          element={
            <ProtectedLayout allowedRoles={["Employee", "Admin", "Super Admin"]}>
              <Deliveries />
            </ProtectedLayout>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedLayout allowedRoles={["Employee", "Admin", "Super Admin"]}>
              <Sales />
            </ProtectedLayout>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedLayout allowedRoles={["Employee", "Admin", "Super Admin"]}>
              <Payments />
            </ProtectedLayout>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedLayout allowedRoles={["Admin", "Super Admin"]}>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedLayout allowedRoles={["Admin", "Super Admin"]}>
              <Categories />
            </ProtectedLayout>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedLayout allowedRoles={["Admin", "Super Admin"]}>
              <Suppliers />
            </ProtectedLayout>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedLayout allowedRoles={["Admin", "Super Admin"]}>
              <Expenses />
            </ProtectedLayout>
          }
        />

        <Route
          path="/losses"
          element={
            <ProtectedLayout allowedRoles={["Admin", "Super Admin"]}>
              <Losses />
            </ProtectedLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedLayout allowedRoles={["Admin", "Super Admin"]}>
              <Reports />
            </ProtectedLayout>
          }
        />

        <Route
  path="/users"
  element={
    <ProtectedLayout allowedRoles={["Admin", "Super Admin"]}>
      <Users />
    </ProtectedLayout>
  }
/>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;