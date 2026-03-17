import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/" replace />;

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
