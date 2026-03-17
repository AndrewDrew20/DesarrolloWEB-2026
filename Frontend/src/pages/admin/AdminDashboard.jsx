import { Link } from "react-router-dom";
import { mockProducts } from "../../data/mockProducts";
import { mockCategories } from "../../data/mockCategories";
import { mockUsers } from "../../data/mockUsers";
import { mockPurchases } from "../../data/mockPurchases";
import "./AdminDashboard.css";

const totalRevenue = mockPurchases.reduce((s, p) => s + p.totalPrice, 0);

const recentOrders = mockPurchases.slice(-3).reverse();

const STATUS_MAP = {
  pending: { label: "Pendiente", cls: "status-pending" },
  shipped: { label: "En camino", cls: "status-shipped" },
  delivered: { label: "Entregado", cls: "status-delivered" },
};

export default function AdminDashboard() {
  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="dash-subtitle">Bienvenido al panel de administración de TechStore.</p>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-num">{mockProducts.length}</p>
            <p className="stat-label">Productos</p>
          </div>
          <Link to="/admin/products" className="stat-link">Ver →</Link>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏷️</span>
          <div>
            <p className="stat-num">{mockCategories.length}</p>
            <p className="stat-label">Categorías</p>
          </div>
          <Link to="/admin/categories" className="stat-link">Ver →</Link>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <p className="stat-num">{mockUsers.length}</p>
            <p className="stat-label">Usuarios</p>
          </div>
          <Link to="/admin/users" className="stat-link">Ver →</Link>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🛍️</span>
          <div>
            <p className="stat-num">{mockPurchases.length}</p>
            <p className="stat-label">Pedidos</p>
          </div>
          <Link to="/admin/orders" className="stat-link">Ver →</Link>
        </div>
        <div className="stat-card highlight">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-num">{formatPrice(totalRevenue)}</p>
            <p className="stat-label">Ingresos totales</p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <section className="recent-orders">
        <div className="section-header">
          <h2>Pedidos recientes</h2>
          <Link to="/admin/orders" className="see-all">Ver todos</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const st = STATUS_MAP[order.status] || { label: order.status, cls: "" };
                return (
                  <tr key={order._id}>
                    <td className="monospace">#{order._id}</td>
                    <td>{order.description}</td>
                    <td>{formatPrice(order.totalPrice)}</td>
                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Low stock */}
      <section className="low-stock">
        <h2>Stock bajo (&lt; 10 unidades)</h2>
        <div className="low-stock-list">
          {mockProducts.filter((p) => p.stock < 10).map((p) => (
            <div key={p._id} className="low-stock-item">
              <img src={p.imageUrl} alt={p.name} />
              <span>{p.name}</span>
              <span className="stock-num">{p.stock} uds.</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
