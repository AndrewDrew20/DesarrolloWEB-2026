import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserRole } from "../../hooks/useUserRole";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { isAuthenticated, isLoading } = useAuth0();
  const role = useUserRole();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Panel Admin</div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            📦 Productos
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            🏷️ Categorías
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            👥 Usuarios
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
            🛍️ Pedidos
          </NavLink>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}